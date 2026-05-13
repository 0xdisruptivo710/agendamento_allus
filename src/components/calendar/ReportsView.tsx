import { useMemo, useState } from "react";
import { format, isSameDay, isWithinInterval, startOfDay, endOfDay, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  DollarSign, TrendingUp, UserCog, Stethoscope, ClipboardList, CalendarRange,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Agendamento } from "@/hooks/useAgendamentos";
import { parseAgendamentoDate } from "@/lib/agendamento-date";

interface ReportsViewProps {
  agendamentos: Agendamento[];
}

const CHART_COLORS = ["#22c55e", "#16a34a", "#84cc16", "#4ade80", "#15803d", "#65a30d", "#86efac"];

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function countBy<T>(arr: T[], key: (i: T) => string | null | undefined) {
  const map = new Map<string, number>();
  for (const item of arr) {
    const k = key(item);
    if (!k) continue;
    map.set(k, (map.get(k) || 0) + 1);
  }
  return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
}

function sumBy<T>(arr: T[], key: (i: T) => string | null | undefined, val: (i: T) => number) {
  const map = new Map<string, number>();
  for (const item of arr) {
    const k = key(item);
    if (!k) continue;
    map.set(k, (map.get(k) || 0) + val(item));
  }
  return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
}

export function ReportsView({ agendamentos }: ReportsViewProps) {
  const [from, setFrom] = useState<string>(() => format(subDays(new Date(), 30), "yyyy-MM-dd"));
  const [to, setTo] = useState<string>(() => format(new Date(), "yyyy-MM-dd"));
  const [selectedDay, setSelectedDay] = useState<string>(() => format(new Date(), "yyyy-MM-dd"));

  const filtered = useMemo(() => {
    const start = startOfDay(new Date(from + "T00:00:00"));
    const end = endOfDay(new Date(to + "T00:00:00"));
    return agendamentos.filter((a) => {
      const d = parseAgendamentoDate(a.Data);
      return d ? isWithinInterval(d, { start, end }) : false;
    });
  }, [agendamentos, from, to]);

  const totalVendas = filtered.reduce((acc, a) => acc + (Number(a.Valor) || 0), 0);
  const totalAgendamentos = filtered.length;
  const ticketMedio = totalAgendamentos > 0 ? totalVendas / totalAgendamentos : 0;

  const dayDate = useMemo(() => new Date(selectedDay + "T00:00:00"), [selectedDay]);
  const doDia = useMemo(
    () => agendamentos.filter((a) => {
      const d = parseAgendamentoDate(a.Data);
      return d ? isSameDay(d, dayDate) : false;
    }),
    [agendamentos, dayDate],
  );
  const vendasDoDia = doDia.reduce((acc, a) => acc + (Number(a.Valor) || 0), 0);

  const porAgendador = useMemo(
    () => countBy(filtered, (a) => a.Responsavel_Agendamento).sort((a, b) => b.value - a.value),
    [filtered],
  );
  const porAtendente = useMemo(
    () => countBy(filtered, (a) => a.Responsavel_Atendimento).sort((a, b) => b.value - a.value),
    [filtered],
  );
  const porTipo = useMemo(
    () => countBy(filtered, (a) => a.Tipo),
    [filtered],
  );
  const vendasPorAtendente = useMemo(
    () => sumBy(filtered, (a) => a.Responsavel_Atendimento, (a) => Number(a.Valor) || 0)
      .sort((a, b) => b.value - a.value),
    [filtered],
  );

  const setRange = (days: number) => {
    setFrom(format(subDays(new Date(), days), "yyyy-MM-dd"));
    setTo(format(new Date(), "yyyy-MM-dd"));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Filtros */}
      <div className="glass-card rounded-2xl p-4 lg:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-center gap-2">
            <CalendarRange className="h-5 w-5 text-green-400" />
            <h3 className="text-lg font-bold text-foreground">Período</h3>
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1">
              <Label className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">De</Label>
              <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="border-border bg-secondary/50" />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Até</Label>
              <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="border-border bg-secondary/50" />
            </div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={() => setRange(7)}>7d</Button>
              <Button variant="outline" size="sm" onClick={() => setRange(30)}>30d</Button>
              <Button variant="outline" size="sm" onClick={() => setRange(90)}>90d</Button>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "Total vendido", value: formatCurrency(totalVendas), icon: DollarSign, color: "text-primary" },
          { label: "Agendamentos", value: totalAgendamentos, icon: ClipboardList, color: "text-primary" },
          { label: "Ticket médio", value: formatCurrency(ticketMedio), icon: TrendingUp, color: "text-primary" },
          { label: `Vendas em ${format(dayDate, "dd/MM")}`, value: formatCurrency(vendasDoDia), icon: DollarSign, color: "text-primary" },
        ].map((s) => (
          <div key={s.label} className="glass-card flex items-center gap-3 rounded-2xl p-4">
            <s.icon className={`h-5 w-5 ${s.color}`} />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{s.label}</p>
              <p className={`text-lg font-extrabold ${s.color}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Vendas em dia específico */}
      <div className="glass-card rounded-2xl p-4 lg:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Análise por dia</p>
            <h3 className="mt-1 text-lg font-bold text-foreground capitalize">
              {format(dayDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </h3>
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Selecione o dia</Label>
            <Input type="date" value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} className="border-border bg-secondary/50" />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-secondary/40 p-3">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Atendimentos</p>
            <p className="text-xl font-extrabold text-foreground">{doDia.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-secondary/40 p-3">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Vendas</p>
            <p className="text-xl font-extrabold text-primary">{formatCurrency(vendasDoDia)}</p>
          </div>
          <div className="rounded-xl border border-border bg-secondary/40 p-3">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Ticket médio</p>
            <p className="text-xl font-extrabold text-primary">
              {formatCurrency(doDia.length > 0 ? vendasDoDia / doDia.length : 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Charts grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Quem mais agendou" icon={UserCog} data={porAgendador} kind="bar" />
        <ChartCard title="Atendimentos por responsável" icon={Stethoscope} data={porAtendente} kind="bar" />
        <ChartCard title="Vendas por responsável (R$)" icon={DollarSign} data={vendasPorAtendente} kind="bar" valueFormatter={formatCurrency} />
        <ChartCard title="Avaliação x Agendamento" icon={ClipboardList} data={porTipo} kind="pie" />
      </div>
    </motion.div>
  );
}

interface ChartCardProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  data: { name: string; value: number }[];
  kind: "bar" | "pie";
  valueFormatter?: (v: number) => string;
}

function ChartCard({ title, icon: Icon, data, kind, valueFormatter }: ChartCardProps) {
  const hasData = data.length > 0 && data.some((d) => d.value > 0);
  return (
    <div className="glass-card rounded-2xl p-4 lg:p-5">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-green-400" />
        <h4 className="text-sm font-bold uppercase tracking-[0.16em] text-foreground">{title}</h4>
      </div>
      {!hasData ? (
        <div className="py-12 text-center text-sm text-muted-foreground">Sem dados no período</div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {kind === "bar" ? (
              <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                  formatter={(v: number) => (valueFormatter ? valueFormatter(v) : v)}
                />
                <Bar dataKey="value" fill="#22c55e" radius={[6, 6, 0, 0]} />
              </BarChart>
            ) : (
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" outerRadius={80} label>
                  {data.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
