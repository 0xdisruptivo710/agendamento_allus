import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type TipoResponsavel = "agendamento" | "atendimento";

export interface Responsavel {
  id: string;
  nome: string;
  tipo: TipoResponsavel;
}

interface ResponsavelRow {
  id: number;
  created_at: string;
  nome: string;
  tipo: TipoResponsavel;
}

const TABLE = "itupevaclinics_responsaveis" as const;
const QUERY_KEY = ["responsaveis"] as const;

const LEGACY_STORAGE_KEY = "drcolageno_responsaveis_v1";

interface LegacyResponsavel {
  id: string;
  nome: string;
  tipo: TipoResponsavel;
}

async function migrateLegacyFromLocalStorage(): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return;
    const list = JSON.parse(raw) as LegacyResponsavel[];
    if (!Array.isArray(list) || list.length === 0) {
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
      return;
    }
    const rows = list
      .filter((r) => r && typeof r.nome === "string" && r.nome.trim() && (r.tipo === "agendamento" || r.tipo === "atendimento"))
      .map((r) => ({ nome: r.nome.trim(), tipo: r.tipo }));
    if (rows.length > 0) {
      await supabase.from(TABLE).upsert(rows, { onConflict: "nome,tipo", ignoreDuplicates: true });
    }
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // ignore — legacy migration is best-effort
  }
}

let legacyMigrationPromise: Promise<void> | null = null;
function ensureLegacyMigrated(): Promise<void> {
  if (!legacyMigrationPromise) legacyMigrationPromise = migrateLegacyFromLocalStorage();
  return legacyMigrationPromise;
}

export function useResponsaveis() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async (): Promise<Responsavel[]> => {
      await ensureLegacyMigrated();
      const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .order("nome", { ascending: true });
      if (error) throw error;
      return (data as ResponsavelRow[]).map((r) => ({
        id: String(r.id),
        nome: r.nome,
        tipo: r.tipo,
      }));
    },
  });

  const list = query.data ?? [];

  const addMutation = useMutation({
    mutationFn: async ({ nome, tipo }: { nome: string; tipo: TipoResponsavel }) => {
      const trimmed = nome.trim();
      if (!trimmed) return null;
      const { data, error } = await supabase
        .from(TABLE)
        .insert({ nome: trimmed, tipo })
        .select()
        .maybeSingle();
      if (error && error.code !== "23505") throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      const numericId = Number(id);
      if (!Number.isFinite(numericId)) return;
      const { error } = await supabase.from(TABLE).delete().eq("id", numericId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, nome }: { id: string; nome: string }) => {
      const trimmed = nome.trim();
      if (!trimmed) return;
      const numericId = Number(id);
      if (!Number.isFinite(numericId)) return;
      const { error } = await supabase.from(TABLE).update({ nome: trimmed }).eq("id", numericId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  const add = useCallback(
    (nome: string, tipo: TipoResponsavel) => {
      if (!nome.trim()) return;
      addMutation.mutate({ nome, tipo });
    },
    [addMutation],
  );

  const remove = useCallback(
    (id: string) => {
      removeMutation.mutate(id);
    },
    [removeMutation],
  );

  const update = useCallback(
    (id: string, nome: string) => {
      if (!nome.trim()) return;
      updateMutation.mutate({ id, nome });
    },
    [updateMutation],
  );

  return {
    all: list,
    agendamento: list.filter((r) => r.tipo === "agendamento"),
    atendimento: list.filter((r) => r.tipo === "atendimento"),
    add,
    remove,
    update,
    isLoading: query.isLoading,
  };
}
