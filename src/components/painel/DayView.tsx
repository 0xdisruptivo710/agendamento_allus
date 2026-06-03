import { useMemo } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarX, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Appointment } from "./data";
import { Avatar, Indicator, StatusBadge } from "./shared";

interface Props {
  currentDate: Date;
  appointments: Appointment[];
  onSelectAppointment: (a: Appointment) => void;
}

export function DayView({ currentDate, appointments, onSelectAppointment }: Props) {
  const items = useMemo(() => {
    const key = format(currentDate, "yyyy-MM-dd");
    return appointments.filter((a) => a.date === key).sort((x, y) => x.time.localeCompare(y.time));
  }, [currentDate, appointments]);

  const label = format(currentDate, "EEEE, d 'de' MMMM", { locale: ptBR });

  return (
    <div className="glass-card overflow-hidden rounded-xl">
      <div className="flex items-center justify-between border-b border-border bg-background/50 px-6 py-3">
        <h3 className="font-heading text-sm font-semibold capitalize text-foreground">{label}</h3>
        <span className="text-xs text-muted-foreground">
          {items.length} {items.length === 1 ? "agendamento" : "agendamentos"}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground">
          <CalendarX className="h-8 w-8 opacity-50" />
          <p className="text-sm">Nenhum agendamento neste dia.</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {items.map((a) => (
            <button
              key={a.id}
              onClick={() => onSelectAppointment(a)}
              className="group flex w-full items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-background/60 md:px-6"
            >
              <div className="w-12 shrink-0">
                <span className={cn("font-heading text-sm font-bold", a.status === "Não compareceu" && "text-muted-foreground line-through")}>
                  {a.time}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{a.name}</p>
                <p className="truncate text-xs text-muted-foreground">{a.vehicle} · {a.tipo}</p>
              </div>
              <div className="hidden items-center gap-2 lg:flex">
                <Avatar name={a.seller} className="h-6 w-6 text-[9px]" />
                <span className="text-sm text-muted-foreground">{a.seller.split(" ")[0]}</span>
              </div>
              <div className="hidden items-center gap-1.5 xl:flex">
                <Indicator ok={a.compareceu} danger />
                <Indicator ok={a.testDrive} />
                <Indicator ok={a.qualificado} />
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={a.status} />
                <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
