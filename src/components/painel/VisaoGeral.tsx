import { useMemo } from "react";
import { ChevronRight } from "lucide-react";
import { formatDayLabel, type Appointment } from "./data";
import { Avatar, StatusBadge } from "./shared";
import { Kpis } from "./Kpis";
import { Ranking } from "./Ranking";

interface Props {
  appointments: Appointment[];
  onSelect: (a: Appointment) => void;
}

export function VisaoGeral({ appointments, onSelect }: Props) {
  const proximos = useMemo(
    () =>
      [...appointments]
        .filter((a) => a.status === "Agendado" || a.status === "Confirmado")
        .sort((a, b) => (a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date)))
        .slice(0, 5),
    [appointments],
  );

  return (
    <div className="space-y-6">
      <Kpis appointments={appointments} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Próximos agendamentos */}
        <div className="glass-card flex flex-col rounded-xl xl:col-span-8">
          <div className="border-b border-border p-6">
            <h3 className="font-heading text-lg font-semibold text-foreground">Próximos Agendamentos</h3>
            <p className="text-sm text-muted-foreground">Confirmados e agendados a seguir</p>
          </div>
          <div className="divide-y divide-border">
            {proximos.map((a) => (
              <button
                key={a.id}
                onClick={() => onSelect(a)}
                className="group flex w-full items-center gap-4 px-6 py-4 text-left transition-colors hover:bg-background/60"
              >
                <div className="w-20 shrink-0">
                  <p className="font-heading text-sm font-bold text-foreground">{a.time}</p>
                  <p className="text-[11px] text-muted-foreground">{formatDayLabel(a.date).replace(" · ", " ")}</p>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{a.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{a.vehicle} · {a.tipo}</p>
                </div>
                <div className="hidden items-center gap-2 sm:flex">
                  <Avatar name={a.seller} className="h-6 w-6 text-[9px]" />
                  <span className="text-sm text-muted-foreground">{a.seller.split(" ")[0]}</span>
                </div>
                <StatusBadge status={a.status} />
                <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </button>
            ))}
          </div>
        </div>

        {/* Ranking */}
        <div className="xl:col-span-4">
          <Ranking />
        </div>
      </div>
    </div>
  );
}
