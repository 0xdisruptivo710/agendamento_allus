import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Acompanhamento {
  id: number;
  created_at: string;
  agendamento_id: number | null;
  paciente_nome: string | null;
  data_inicio: string | null;
  data_fim_tratamento: string | null;
  status: string | null;
  observacoes: string | null;
}

export interface AcompanhamentoFoto {
  id: number;
  created_at: string;
  acompanhamento_id: number;
  foto_url: string;
  foto_path: string | null;
  data_foto: string | null;
  ordem: number | null;
  nota: string | null;
}

const T_ACOMP = "Acompanhamento_DrColageno_Piracicaba" as const;
const T_FOTOS = "Acompanhamento_Fotos_DrColageno_Piracicaba" as const;
const BUCKET = "acompanhamento-fotos";

export function useAcompanhamentos() {
  return useQuery({
    queryKey: ["acompanhamentos"],
    queryFn: async () => {
      // @ts-ignore - tabela criada via SQL manual
      const { data, error } = await supabase.from(T_ACOMP).select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Acompanhamento[];
    },
  });
}

export function useAcompanhamentoFotos(acompanhamentoId: number | null) {
  return useQuery({
    queryKey: ["acompanhamento-fotos", acompanhamentoId],
    enabled: !!acompanhamentoId,
    queryFn: async () => {
      // @ts-ignore - tabela criada via SQL manual
      const { data, error } = await supabase.from(T_FOTOS).select("*").eq("acompanhamento_id", acompanhamentoId).order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as AcompanhamentoFoto[];
    },
  });
}

export function useUpsertAcompanhamento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Partial<Acompanhamento>) => {
      // @ts-ignore - tabela criada via SQL manual
      const q = input.id ? supabase.from(T_ACOMP).update(input).eq("id", input.id).select().maybeSingle() : supabase.from(T_ACOMP).insert(input).select().maybeSingle();
      const { data, error } = await q;
      if (error) throw error;
      return data as Acompanhamento;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["acompanhamentos"] }),
  });
}

export function useDeleteAcompanhamento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      // @ts-ignore - tabela criada via SQL manual
      const { error } = await supabase.from(T_ACOMP).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["acompanhamentos"] }),
  });
}

export function useUploadFoto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ acompanhamentoId, file, nota }: { acompanhamentoId: number; file: File; nota?: string }) => {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${acompanhamentoId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, { cacheControl: "3600", upsert: false });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
      // @ts-ignore - tabela criada via SQL manual
      const { data, error } = await supabase.from(T_FOTOS).insert({
        acompanhamento_id: acompanhamentoId,
        foto_url: pub.publicUrl,
        foto_path: path,
        nota: nota || null,
      }).select().maybeSingle();
      if (error) throw error;
      return data as AcompanhamentoFoto;
    },
    onSuccess: (_d, vars) => qc.invalidateQueries({ queryKey: ["acompanhamento-fotos", vars.acompanhamentoId] }),
  });
}

export function useDeleteFoto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (foto: AcompanhamentoFoto) => {
      if (foto.foto_path) {
        await supabase.storage.from(BUCKET).remove([foto.foto_path]);
      }
      // @ts-ignore - tabela criada via SQL manual
      const { error } = await supabase.from(T_FOTOS).delete().eq("id", foto.id);
      if (error) throw error;
    },
    onSuccess: (_d, foto) => qc.invalidateQueries({ queryKey: ["acompanhamento-fotos", foto.acompanhamento_id] }),
  });
}
