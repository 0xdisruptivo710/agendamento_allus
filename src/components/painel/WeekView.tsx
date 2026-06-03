import { useMemo } from "react";
import { eachDayOfInterval, endOfWeek, format, startOfWeek } from "date-fns";
import { cn } from "@/lib/utils";
import { statusDot, TODAY, type Appointment } from "./data";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

interface Props {
  currentDate: Date;
  appointments: Appointment[];
  onSelectAppointment: (a: Appointment) => void;
}

export function WeekView({ currentDate, appointments, onSelectAppointment }: Props) {
  const days = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end: endOfWeek(currentDate, { weekStartsOn: 0 }) });
  }, [currentDate]);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-7">
      {days.map((day) => {
        const key = format(day, "yyyy-MM-dd");
        const items = appointments
          .filter((a) => a.date === key)
          .sort((x, y) => x.time.localeCompare(y.time));
        const isToday = key === TODAY;

        return (
          <div key={key} className="glass-card flex min-h-[220px] flex-col rounded-xl p-2.5">
            <div className="mb-2 flex items-center justify-between border-b border-border pb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {WEEKDAYS[day.getDay()]}
              </span>
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                  isToday ? "bg-primary text-primary-foreground" : "text-foreground",
                )}
              >
                {format(day, "d")}
              </span>
            </div>

            <div className="space-y-2">
              {items.map((a) => (
                <button
                  key={a.id}
                  onClick={() => onSelectAppointment(a)}
                  className="block w-full rounded-lg border border-border bg-background/50 p-2 text-left transition-colors hover:bg-muted"
                >
                  <div className="mb-0.5 flex items-center gap-1.5">
                    <span className={cn("h-1.5 w-1.5 rounded-full", statusDot[a.status])} />
                    <span className="font-heading text-xs font-bold text-foreground">{a.time}</span>
                  </div>
                  <p className="truncate text-xs font-medium text-foreground">{a.name}</p>
                  <p className="truncate text-[10px] text-muted-foreground">{a.vehicle}</p>
                </button>
              ))}
              {items.length === 0 && <p className="px-1 text-[11px] text-muted-foreground/70">—</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
