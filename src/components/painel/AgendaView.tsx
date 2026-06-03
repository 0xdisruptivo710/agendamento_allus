import { useState } from "react";
import {
  addDays,
  addMonths,
  addWeeks,
  endOfWeek,
  format,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Appointment } from "./data";
import { MonthView } from "./MonthView";
import { WeekView } from "./WeekView";
import { DayView } from "./DayView";

type View = "month" | "week" | "day";

const VIEWS: { id: View; label: string }[] = [
  { id: "month", label: "Mês" },
  { id: "week", label: "Semana" },
  { id: "day", label: "Dia" },
];

interface Props {
  appointments: Appointment[];
  onSelect: (a: Appointment) => void;
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function AgendaView({ appointments, onSelect }: Props) {
  // Initialise on the sample data's window (June 2026) so appointments are visible.
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 5, 3));
  const [view, setView] = useState<View>("month");

  const prev = () =>
    setCurrentDate((d) => (view === "month" ? subMonths(d, 1) : view === "week" ? subWeeks(d, 1) : subDays(d, 1)));
  const next = () =>
    setCurrentDate((d) => (view === "month" ? addMonths(d, 1) : view === "week" ? addWeeks(d, 1) : addDays(d, 1)));
  const goToday = () => setCurrentDate(new Date(2026, 5, 3));

  const label = (() => {
    if (view === "month") return cap(format(currentDate, "MMMM 'de' yyyy", { locale: ptBR }));
    if (view === "week") {
      const ws = startOfWeek(currentDate, { weekStartsOn: 0 });
      const we = endOfWeek(currentDate, { weekStartsOn: 0 });
      return `${format(ws, "d 'de' MMM", { locale: ptBR })} – ${format(we, "d 'de' MMM", { locale: ptBR })}`;
    }
    return cap(format(currentDate, "EEEE, d 'de' MMMM", { locale: ptBR }));
  })();

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-border bg-card">
            <button onClick={prev} className="flex h-8 w-8 items-center justify-center rounded-l-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={next} className="flex h-8 w-8 items-center justify-center rounded-r-lg border-l border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={goToday}
            className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Hoje
          </button>
          <h3 className="ml-1 font-heading text-base font-semibold text-foreground">{label}</h3>
        </div>

        {/* View switch */}
        <div className="inline-flex rounded-lg border border-border bg-card p-0.5">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              className={cn(
                "rounded-md px-3 py-1 text-sm font-medium transition-colors",
                view === v.id ? "bg-secondary text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Views */}
      {view === "month" && (
        <MonthView
          currentDate={currentDate}
          appointments={appointments}
          onSelectAppointment={onSelect}
          onSelectDay={(day) => {
            setCurrentDate(day);
            setView("day");
          }}
        />
      )}
      {view === "week" && (
        <WeekView currentDate={currentDate} appointments={appointments} onSelectAppointment={onSelect} />
      )}
      {view === "day" && (
        <DayView currentDate={currentDate} appointments={appointments} onSelectAppointment={onSelect} />
      )}
    </div>
  );
}
