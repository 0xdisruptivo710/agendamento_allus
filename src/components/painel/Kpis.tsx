import {
  BadgeCheck,
  CalendarPlus,
  Car,
  CircleDollarSign,
  Gauge,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatBRL, type Appointment } from "./data";

type Tone = "primary" | "emerald" | "amber";

const iconTone: Record<Tone, string> = {
  primary: "bg-secondary text-primary",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
};

/** Every KPI is computed live from the loaded appointments. */
export function Kpis({ appointments }: { appointments: Appointment[] }) {
  const total = appointments.length;
  const testDrives = appointments.filter((a) => a.testDrive).length;
  const qualificados = appointments.filter((a) => a.qualificado).length;
  const vendidos = appointments.filter((a) => a.status === "Concluído");
  const vendas = vendidos.length;
  const faturamento = vendidos.reduce((s, a) => s + (a.valor || 0), 0);

  const withOutcome = appointments.filter((a) => a.status !== "Agendado" && a.status !== "Confirmado");
  const present = withOutcome.filter((a) => a.compareceu).length;
  const comparecimento = withOutcome.length ? `${Math.round((present / withOutcome.length) * 100)}%` : "—";

  const cards: { label: string; value: string; icon: LucideIcon; tone: Tone }[] = [
    { label: "Agendamentos", value: String(total), icon: CalendarPlus, tone: "primary" },
    { label: "Test Drives", value: String(testDrives), icon: Gauge, tone: "primary" },
    { label: "Comparecimento", value: comparecimento, icon: UserCheck, tone: "amber" },
    { label: "Qualificados", value: String(qualificados), icon: BadgeCheck, tone: "primary" },
    { label: "Vendas", value: String(vendas), icon: Car, tone: "primary" },
    { label: "Faturamento", value: formatBRL(faturamento), icon: CircleDollarSign, tone: "emerald" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
      {cards.map((kpi) => (
        <div key={kpi.label} className="glass-card rounded-xl p-5">
          <div className={cn("mb-4 flex h-10 w-10 items-center justify-center rounded-lg", iconTone[kpi.tone])}>
            <kpi.icon className="h-5 w-5" />
          </div>
          <p className="mb-1 text-sm font-medium text-muted-foreground">{kpi.label}</p>
          <h3 className="font-heading text-2xl font-bold leading-none text-foreground">{kpi.value}</h3>
        </div>
      ))}
    </div>
  );
}
