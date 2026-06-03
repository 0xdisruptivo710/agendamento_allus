import { useMemo } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowRight, BadgeCheck, CircleDollarSign, Gauge, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatBRL, sellerStats, type Appointment } from "./data";

const PURPLE = "#5B4FE3";
const EMERALD = "#10b981";
const RED = "#ef4444";
const GRAY = "#cbd5e1";

export function Relatorios({ appointments }: { appointments: Appointment[] }) {
  const m = useMemo(() => {
    const total = appointments.length;
    const compareceram = appointments.filter((a) => a.compareceu).length;
    const faltaram = appointments.filter((a) => a.status === "Não compareceu").length;
    const pendentes = appointments.filter((a) => a.status === "Agendado" || a.status === "Confirmado").length;
    const testDrives = appointments.filter((a) => a.testDrive).length;
    const qualificados = appointments.filter((a) => a.qualificado).length;
    const vendas = appointments.filter((a) => a.status === "Concluído").length;
    const decididos = compareceram + faltaram;
    const taxaComp = decididos ? Math.round((compareceram / decididos) * 100) : 0;
    const taxaTd = compareceram ? Math.round((testDrives / compareceram) * 100) : 0;
    const taxaQual = total ? Math.round((qualificados / total) * 100) : 0;
    return { total, compareceram, faltaram, pendentes, testDrives, qualificados, vendas, decididos, taxaComp, taxaTd, taxaQual };
  }, [appointments]);

  const situacao = [
    { name: "Compareceram", value: m.compareceram, color: EMERALD },
    { name: "Não compareceram", value: m.faltaram, color: RED },
    { name: "Pendentes", value: m.pendentes, color: GRAY },
  ].filter((s) => s.value > 0);

  const vendedores = useMemo(() => sellerStats(appointments), [appointments]);
  const faturamento = vendedores.reduce((s, v) => s + v.faturamento, 0);
  const vendasTotal = vendedores.reduce((s, v) => s + v.vendas, 0);
  const ticket = vendasTotal ? faturamento / vendasTotal : 0;
  const vendasPorVendedor = vendedores.map((v) => ({ name: v.name.split(" ")[0], vendas: v.vendas }));

  const stats = [
    { label: "Taxa de comparecimento", value: m.decididos ? `${m.taxaComp}%` : "—", icon: UserCheck, tone: "emerald" as const },
    { label: "Test drives realizados", value: `${m.testDrives}`, icon: Gauge, tone: "primary" as const },
    { label: "Clientes qualificados", value: `${m.qualificados}`, icon: BadgeCheck, tone: "primary" as const },
    { label: "Ticket médio", value: vendasTotal ? formatBRL(ticket) : "—", icon: CircleDollarSign, tone: "emerald" as const },
  ];

  const iconTone = {
    primary: "bg-secondary text-primary",
    emerald: "bg-emerald-50 text-emerald-600",
  };

  const conversion = [
    { label: "Agendados", value: m.total },
    { label: "Compareceram", value: m.compareceram },
    { label: "Test drive", value: m.testDrives },
    { label: "Vendas", value: m.vendas },
  ];

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-5">
            <div className={cn("mb-3 flex h-10 w-10 items-center justify-center rounded-lg", iconTone[s.tone])}>
              <s.icon className="h-5 w-5" />
            </div>
            <p className="mb-1 text-sm font-medium text-muted-foreground">{s.label}</p>
            <h3 className="font-heading text-2xl font-bold leading-none text-foreground">{s.value}</h3>
          </div>
        ))}
      </div>

      {/* Conversion strip */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="mb-5 font-heading text-lg font-semibold text-foreground">Conversão do período</h3>
        <div className="flex flex-wrap items-center gap-2">
          {conversion.map((c, i) => (
            <div key={c.label} className="flex items-center gap-2">
              <div className="rounded-xl border border-border bg-background/50 px-4 py-3 text-center">
                <p className="font-heading text-xl font-bold text-foreground">{c.value}</p>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{c.label}</p>
              </div>
              {i < conversion.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="glass-card rounded-xl p-6">
          <h3 className="mb-1 font-heading text-lg font-semibold text-foreground">Vendas por vendedor</h3>
          <p className="mb-4 text-sm text-muted-foreground">Vendas concluídas</p>
          {vendasPorVendedor.length === 0 ? (
            <div className="flex h-[260px] flex-col items-center justify-center gap-1 text-center text-muted-foreground">
              <p className="text-sm">Sem vendas concluídas ainda.</p>
              <p className="text-xs">Os dados aparecem quando agendamentos forem marcados como Concluído.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={vendasPorVendedor} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} stroke="#6b7280" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="#6b7280" allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: "rgba(91,79,227,0.06)" }}
                  contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 13 }}
                />
                <Bar dataKey="vendas" fill={PURPLE} radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="mb-1 font-heading text-lg font-semibold text-foreground">Situação dos agendamentos</h3>
          <p className="mb-4 text-sm text-muted-foreground">Distribuição ao vivo da agenda</p>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="55%" height={220}>
              <PieChart>
                <Pie data={situacao} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                  {situacao.map((s) => (
                    <Cell key={s.name} fill={s.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {situacao.map((s) => (
                <div key={s.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    {s.name}
                  </span>
                  <span className="font-semibold text-foreground">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
