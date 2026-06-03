import {
  BadgeCheck,
  CalendarPlus,
  Car,
  CircleDollarSign,
  Gauge,
  TrendingDown,
  TrendingUp,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Appointment } from "./data";

type Tone = "primary" | "emerald" | "amber";

const iconTone: Record<Tone, string> = {
  primary: "bg-secondary text-primary",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
};

/**
 * KPIs are monthly aggregates (sample figures). The "Comparecimento" card is
 * derived live from the agenda so edits in the dialog are reflected here.
 */
export function Kpis({ appointments }: { appointments: Appointment[] }) {
  const withOutcome = appointments.filter((a) => a.status !== "Agendado" && a.status !== "Confirmado");
  const present = withOutcome.filter((a) => a.compareceu).length;
  const liveComparecimento = withOutcome.length ? Math.round((present / withOutcome.length) * 100) : 0;

  const cards: { label: string; value: string; delta: string; up: boolean; icon: LucideIcon; tone: Tone }[] = [
    { label: "Agendamentos", value: "184", delta: "12%", up: true, icon: CalendarPlus, tone: "primary" },
    { label: "Test Drives", value: "92", delta: "8%", up: true, icon: Gauge, tone: "primary" },
    { label: "Comparecimento", value: `${liveComparecimento}%`, delta: "2%", up: false, icon: UserCheck, tone: "amber" },
    { label: "Qualificados", value: "118", delta: "9%", up: true, icon: BadgeCheck, tone: "primary" },
    { label: "Vendas no Mês", value: "47", delta: "15%", up: true, icon: Car, tone: "primary" },
    { label: "Faturamento", value: "R$ 5,42M", delta: "22%", up: true, icon: CircleDollarSign, tone: "emerald" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
      {cards.map((kpi) => (
        <div key={kpi.label} className="glass-card rounded-xl p-5">
          <div className="mb-4 flex items-start justify-between">
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", iconTone[kpi.tone])}>
              <kpi.icon className="h-5 w-5" />
            </div>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold",
                kpi.up ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600",
              )}
            >
              {kpi.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {kpi.delta}
            </span>
          </div>
          <p className="mb-1 text-sm font-medium text-muted-foreground">{kpi.label}</p>
          <h3 className="font-heading text-2xl font-bold leading-none text-foreground">{kpi.value}</h3>
        </div>
      ))}
    </div>
  );
}
