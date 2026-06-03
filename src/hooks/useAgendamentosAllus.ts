import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { appointmentToRow, rowToAppointment, type AllusRow } from "@/lib/allus";
import type { Appointment } from "@/components/painel/data";

const TABLE = "Agendamento_Allus";
const KEY = ["agendamentos-allus"];

/** Fetches all rows from Agendamento_Allus and maps them to Appointments. */
export function useAgendamentosAllus() {
  return useQuery({
    queryKey: KEY,
    queryFn: async (): Promise<Appointment[]> => {
      const { data, error } = await supabase.from(TABLE).select("*").order("id", { ascending: false });
      if (error) throw error;
      return ((data ?? []) as AllusRow[]).map(rowToAppointment);
    },
  });
}

/** Persists the panel-editable sales columns back to the row. */
export function useUpdateAgendamento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (appt: Appointment) => {
      const { error } = await supabase.from(TABLE).update(appointmentToRow(appt)).eq("id", Number(appt.id));
      if (error) throw error;
      return appt;
    },
    onSuccess: (appt) => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Agendamento atualizado", {
        description: appt.vehicle ? `${appt.name} · ${appt.vehicle}` : appt.name,
      });
    },
    onError: (e: unknown) => {
      toast.error("Erro ao salvar", { description: e instanceof Error ? e.message : String(e) });
    },
  });
}
