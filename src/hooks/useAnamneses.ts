import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Anamnese {
  id: number;
  created_at: string;
  agendamento_id: number | null;
  paciente_nome: string | null;
  paciente_telefone: string | null;
  data_anamnese: string | null;
  queixa_principal: string | null;
  historico_saude: string | null;
  alergias: string | null;
  medicamentos: string | null;
  cirurgias_previas: string | null;
  gestante: boolean | null;
  procedimentos_anteriores: string | null;
  tabagismo: boolean | null;
  etilismo: boolean | null;
  tipo_pele: string | null;
  exposicao_solar: string | null;
  observacoes: string | null;
}

const TABLE = "barradatijucaclinics_anamnese" as const;

export function useAnamneses() {
  return useQuery({
    queryKey: ["anamneses"],
    queryFn: async () => {
      // @ts-ignore - tabela criada via SQL manual
      const { data, error } = await supabase.from(TABLE).select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Anamnese[];
    },
  });
}

export function useUpsertAnamnese() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Partial<Anamnese>) => {
      // @ts-ignore - tabela criada via SQL manual
      const q = input.id ? supabase.from(TABLE).update(input).eq("id", input.id).select().maybeSingle() : supabase.from(TABLE).insert(input).select().maybeSingle();
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["anamneses"] }),
  });
}

export function useDeleteAnamnese() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      // @ts-ignore - tabela criada via SQL manual
      const { error } = await supabase.from(TABLE).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["anamneses"] }),
  });
}
