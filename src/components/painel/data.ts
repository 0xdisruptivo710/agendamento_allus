/* ------------------------------------------------------------------ */
/* Domain types + helpers for the Allus Veículos sales panel.          */
/* Data comes live from Supabase (table Agendamento_Allus).            */
/* ------------------------------------------------------------------ */

export type Status =
  | "Agendado"
  | "Confirmado"
  | "Compareceu"
  | "Não compareceu"
  | "Concluído"
  | "Cancelado";

export type Tipo = "Test Drive" | "Visita" | "Avaliação de Troca" | "Entrega" | "Proposta";

export interface Appointment {
  id: string;
  date: string; // ISO yyyy-mm-dd
  time: string; // "10:30"
  name: string;
  phone: string;
  vehicle: string;
  tipo: Tipo;
  seller: string;
  status: Status;
  compareceu: boolean;
  testDrive: boolean;
  qualificado: boolean;
  observacoes: string;
  valor: number; // valor da venda (R$); 0 quando não informado
}

export const TODAY = "2026-06-03";

export const STATUSES: Status[] = [
  "Agendado",
  "Confirmado",
  "Compareceu",
  "Não compareceu",
  "Concluído",
  "Cancelado",
];

export const TIPOS: Tipo[] = ["Test Drive", "Visita", "Avaliação de Troca", "Entrega", "Proposta"];

export const SELLERS = ["Eduardo", "Giovanna", "Lucas", "Danilo (Líder)"];

export const statusMeta: Record<Status, string> = {
  Agendado: "bg-secondary text-primary",
  Confirmado: "bg-blue-50 text-blue-700 border border-blue-200",
  Compareceu: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "Não compareceu": "bg-red-50 text-red-600 border border-red-200",
  Concluído: "bg-emerald-600 text-white",
  Cancelado: "bg-muted text-muted-foreground line-through",
};

/** Solid dot colors for calendar chips. */
export const statusDot: Record<Status, string> = {
  Agendado: "bg-primary",
  Confirmado: "bg-blue-500",
  Compareceu: "bg-emerald-500",
  "Não compareceu": "bg-red-500",
  Concluído: "bg-emerald-600",
  Cancelado: "bg-muted-foreground",
};

export function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const TOMORROW = "2026-06-04";

/** "Hoje · 03 de Junho" / "Amanhã · 04 de Junho" / "05 de Junho" */
export function formatDayLabel(iso: string) {
  if (!iso) return "Sem data";
  const [, m, d] = iso.split("-");
  const base = `${d} de ${MONTHS[Number(m) - 1]}`;
  if (iso === TODAY) return `Hoje · ${base}`;
  if (iso === TOMORROW) return `Amanhã · ${base}`;
  return base;
}

/** Compact BRL: R$ 5,42M / R$ 12,5k / R$ 980 */
export function formatBRL(n: number) {
  if (!n) return "R$ 0";
  if (Math.abs(n) >= 1_000_000) return `R$ ${(n / 1_000_000).toFixed(2).replace(".", ",")}M`;
  if (Math.abs(n) >= 1_000) return `R$ ${(n / 1_000).toFixed(1).replace(".", ",")}k`;
  return `R$ ${n.toLocaleString("pt-BR")}`;
}

export interface SellerStat {
  name: string;
  vendas: number;
  faturamento: number;
}

/** Sales ranking computed from concluded appointments, by revenue. */
export function sellerStats(appointments: Appointment[]): SellerStat[] {
  const map = new Map<string, SellerStat>();
  for (const a of appointments) {
    if (a.status !== "Concluído") continue;
    const name = a.seller?.trim() || "Sem vendedor";
    const s = map.get(name) ?? { name, vendas: 0, faturamento: 0 };
    s.vendas += 1;
    s.faturamento += a.valor || 0;
    map.set(name, s);
  }
  return [...map.values()].sort((x, y) => y.faturamento - x.faturamento || y.vendas - x.vendas);
}
