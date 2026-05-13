import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PROCEDIMENTOS_ESTETICOS } from "@/lib/procedimentos";

interface ProcedimentoRow {
  id: number;
  created_at: string;
  nome: string;
  ativo: boolean;
  ordem: number;
}

const TABLE = "Procedimentos_DrColageno_Piracicaba" as const;

export function useProcedimentos() {
  const query = useQuery({
    queryKey: ["procedimentos"],
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
