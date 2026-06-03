import { useMemo } from "react";
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { cn } from "@/lib/utils";
import { statusDot, TODAY, type Appointment } from "./data";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

interface Props {
  currentDate: Date;
  appointments: Appointment[];
  onSelectAppointment: (a: Appointment) => void;
  onSelectDay: (day: Date) => void;
}

export function MonthView({ currentDate, appointments, onSelectAppointment, onSelectDay }: Props) {
  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const byDay = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    for (const a of appointments) {
      const list = map.get(a.date) ?? [];
      list.push(a);
      map.set(a.date, list);
    }
    for (const list of map.values()) list.sort((x, y) => x.time.localeCompare(y.time));
    return map;
  }, [appointments]);

  return (
    <div className="glass-card rounded-xl p-3 md:p-4">
      <div className="mb-2 grid grid-cols-7">
        {WEEKDAYS.map((w) => (
          <div key={w} className="px-1 pb-1 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const items = byDay.get(key) ?? [];
          const inMonth = isSameMonth(day, currentDate);
          const isToday = key === TODAY;

          return (
            <div
              key={key}
              className={cn(
                "min-h-[96px] rounded-lg border border-border p-1.5",
                inMonth ? "bg-card" : "bg-background/40",
              )}
            >
              <button
                onClick={() => onSelectDay(day)}
                className={cn(
                  "mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-colors hover:bg-muted",
                  isToday ? "bg-primary text-primary-foreground hover:bg-primary" : inMonth ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {format(day, "d")}
              </button>

              <div className="space-y-0.5">
                {items.slice(0, 3).map((a) => (
                  <button
                    key={a.id}
                    onClick={() => onSelectAppointment(a)}
                    className="flex w-full items-center gap-1 rounded px-1 py-0.5 text-left text-[10px] transition-colors hover:bg-muted"
                  >
                    <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", statusDot[a.status])} />
                    <span className="font-semibold text-foreground">{a.time}</span>
                    <span className="truncate text-muted-foreground">{a.name}</span>
                  </button>
                ))}
                {items.length > 3 && (
                  <button
                    onClick={() => onSelectDay(day)}
                    className="px-1 text-[10px] font-medium text-primary hover:underline"
                  >
                    +{items.length - 3} mais
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
