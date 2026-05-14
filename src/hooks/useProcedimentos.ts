import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PROCEDIMENTOS_ESTETICOS } from "@/lib/procedimentos";

interface ProcedimentoRow {
  id: number;
  created_at: string;
  nome: string;
  ativo: boolean;
  ordem: number;
}

const TABLE = "barradatijucaclinics_procedimentos" as const;
const QUERY_KEY = ["procedimentos"] as const;

export function useProcedimentos() {
  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async (): Promise<string[]> => {
      const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("ativo", true)
        .order("ordem", { ascending: true })
        .order("nome", { ascending: true });
      if (error) throw error;
      return (data as ProcedimentoRow[]).map((r) => r.nome);
    },
    staleTime: 1000 * 60 * 5,
  });

  return {
    list: query.data ?? PROCEDIMENTOS_ESTETICOS,
    isLoading: query.isLoading,
  };
}

export function useAddProcedimento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (nome: string): Promise<string> => {
      const trimmed = nome.trim();
      if (!trimmed) throw new Error("Nome do procedimento vazio");
      const { error } = await supabase
        .from(TABLE)
        .insert({ nome: trimmed, ativo: true });
      // 23505 = unique violation — trata como sucesso (já existe)
      if (error && error.code !== "23505") throw error;
      return trimmed;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
