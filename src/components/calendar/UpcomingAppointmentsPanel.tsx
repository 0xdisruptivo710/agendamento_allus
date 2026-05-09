import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";
import { Clock3, StickyNote, UserRound } from "lucide-react";
import type { Agendamento } from "@/hooks/useAgendamentos";
import { formatAgendamentoTime, isUpcomingAgendamento, parseAgendamentoDate } from "@/lib/agendamento-date";

interface UpcomingAppointmentsPanelProps {
  agendamentos: Agendamento[];
  onEventClick: (event: Agendamento) => void;
}

export function UpcomingAppointmentsPanel({ agendamentos, onEventClick }: UpcomingAppointmentsPanelProps) {
  const upcoming = agendamentos
    .filter((item) => isUpcomingAgendamento(item.Data))
    .slice(0, 10);

  return (
    <aside className="glass-card rounded-2xl p-4 lg:p-5 h-full">
      <div className="mb-4">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Próximos cards</p>
        <h3 className="mt-1 text-xl font-extrabold text-foreground">Agendamentos visíveis</h3>
      </div>

      <div className="space-y-3">
        {upcoming.length === 0 ? (
          <div className="rounded-xl border border-border bg-secondary/50 p-4 text-sm text-muted-foreground">
            Nenhum agendamento válido encontrado para exibir.
          </div>
        ) : (
          upcoming.map((event, index) => {
            const parsedDate = parseAgendamentoDate(event.Data);

            return (
              <motion.button
                key={event.id}
                type="button"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                onClick={() => onEventClick(event)}
                className="w-full rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary/50 hover:shadow-[var(--shadow-glow)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-foreground">
                      <UserRound className="h-4 w-4 text-green-400" />
                      <span className="font-bold leading-tight">{event.Nome || "Paciente sem nome"}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground capitalize">
                      {parsedDate ? format(parsedDate, "dd 'de' MMMM", { locale: ptBR }) : "Data inválida"}
                    </p>
                  </div>
                  <div className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                    {formatAgendamentoTime(event.Data)}
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock3 className="h-3.5 w-3.5 text-green-500" />
                  <span>{event.Confirmação || "Pendente de confirmação"}</span>
                </div>

                <div className="mt-2 flex items-start gap-2 text-xs text-muted-foreground">
                  <StickyNote className="mt-0.5 h-3.5 w-3.5 text-green-400" />
                  <span className="line-clamp-2">{event.Anotações || "Clique para adicionar anotações."}</span>
                </div>
              </motion.button>
            );
          })
        )}
      </div>
    </aside>
  );
}
