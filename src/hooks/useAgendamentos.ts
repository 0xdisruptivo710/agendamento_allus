import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { compareAgendamentoDates } from "@/lib/agendamento-date";

export interface Agendamento {
  id: number;
  created_at: string;
  Data: string | null;
  Nome: string | null;
  "Número": string | null;
  Anotações: string | null;
  Confirmação: string | null;
  "1 Dia antes": string | null;
  "No dia": string | null;
  Valor: number | null;
  Responsavel_Agendamento: string | null;
  Responsavel_Atendimento: string | null;
  Tipo: string | null;
  Procedimento: string | null;
}

export function useAgendamentos() {
  return useQuery({
    queryKey: ["agendamentos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("barradatijucaclinics_agendamento")
        .select("*");

      if (error) throw error;

      return [...(data as Agendamento[])].sort((a, b) => compareAgendamentoDates(a.Data, b.Data));
    },
  });
}

export function useUpdateAgendamento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Agendamento> }) => {
      const { data, error } = await supabase
        .from("barradatijucaclinics_agendamento")
        .update(updates)
        .eq("id", id)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agendamentos"] });
    },
  });
}
