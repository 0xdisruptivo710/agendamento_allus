/* ------------------------------------------------------------------ */
/* Domain types + sample data for the Allus Veículos sales panel.      */
/* Sample data only — wire to the Aios platform later.                 */
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

export const SELLERS = ["Ana Silva", "Carlos Eduardo", "Felipe Rocha", "Mariana Teixeira"];

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

export const initialAppointments: Appointment[] = [
  { id: "a1", date: "2026-06-03", time: "09:00", name: "Juliana Costa", phone: "(11) 99610-3408", vehicle: "Honda HR-V Advance", tipo: "Avaliação de Troca", seller: "Felipe Rocha", status: "Não compareceu", compareceu: false, testDrive: false, qualificado: false, observacoes: "Não atendeu as ligações de confirmação." },
  { id: "a2", date: "2026-06-03", time: "10:30", name: "Marcelo Nogueira", phone: "(11) 99822-4845", vehicle: "Jeep Compass Longitude", tipo: "Test Drive", seller: "Ana Silva", status: "Compareceu", compareceu: true, testDrive: true, qualificado: true, observacoes: "Gostou muito do carro, pretende financiar em 48x." },
  { id: "a3", date: "2026-06-03", time: "11:00", name: "Roberto Almeida", phone: "(11) 98123-7720", vehicle: "Toyota Corolla Altis", tipo: "Visita", seller: "Carlos Eduardo", status: "Compareceu", compareceu: true, testDrive: false, qualificado: true, observacoes: "Quer comparar com o Civic antes de decidir." },
  { id: "a4", date: "2026-06-03", time: "14:30", name: "Ricardo Moura", phone: "(11) 99774-1221", vehicle: "VW Nivus Highline", tipo: "Entrega", seller: "Ana Silva", status: "Concluído", compareceu: true, testDrive: true, qualificado: true, observacoes: "Entrega concluída. Cliente muito satisfeito." },
  { id: "a5", date: "2026-06-03", time: "15:30", name: "Patrícia Lemos", phone: "(11) 98890-5510", vehicle: "Hyundai Creta Ultimate", tipo: "Visita", seller: "Carlos Eduardo", status: "Compareceu", compareceu: true, testDrive: false, qualificado: false, observacoes: "Apenas pesquisando preços, sem urgência." },
  { id: "a6", date: "2026-06-03", time: "16:45", name: "Bruno Carvalho", phone: "(11) 99001-2288", vehicle: "Fiat Toro Volcano", tipo: "Test Drive", seller: "Felipe Rocha", status: "Confirmado", compareceu: false, testDrive: false, qualificado: true, observacoes: "" },
  { id: "a7", date: "2026-06-04", time: "09:30", name: "Sandra Ribeiro", phone: "(11) 98321-4567", vehicle: "Chevrolet Tracker Premier", tipo: "Test Drive", seller: "Ana Silva", status: "Agendado", compareceu: false, testDrive: false, qualificado: false, observacoes: "" },
  { id: "a8", date: "2026-06-04", time: "11:15", name: "Eduardo Pires", phone: "(11) 99456-1102", vehicle: "Jeep Renegade", tipo: "Avaliação de Troca", seller: "Mariana Teixeira", status: "Agendado", compareceu: false, testDrive: false, qualificado: false, observacoes: "Trará o Onix 2019 para avaliação." },
  { id: "a9", date: "2026-06-04", time: "14:00", name: "Tiago Fontes", phone: "(11) 98777-9090", vehicle: "Toyota Hilux SRX", tipo: "Proposta", seller: "Carlos Eduardo", status: "Confirmado", compareceu: false, testDrive: false, qualificado: true, observacoes: "Negociação em andamento, aguardando aprovação de crédito." },
  { id: "a10", date: "2026-06-05", time: "10:00", name: "Camila Duarte", phone: "(11) 99233-8845", vehicle: "Honda City Touring", tipo: "Visita", seller: "Felipe Rocha", status: "Agendado", compareceu: false, testDrive: false, qualificado: false, observacoes: "" },
  { id: "a11", date: "2026-06-05", time: "13:30", name: "Rogério Maia", phone: "(11) 98654-3321", vehicle: "VW T-Cross Highline", tipo: "Test Drive", seller: "Ana Silva", status: "Agendado", compareceu: false, testDrive: false, qualificado: false, observacoes: "" },
  { id: "a12", date: "2026-06-06", time: "15:00", name: "Letícia Barros", phone: "(11) 99888-1100", vehicle: "Fiat Pulse Impetus", tipo: "Entrega", seller: "Mariana Teixeira", status: "Agendado", compareceu: false, testDrive: false, qualificado: false, observacoes: "" },
];

export const ranking: { pos: number; name: string; sales: number; total: string; gold?: boolean }[] = [
  { pos: 1, name: "Ana Silva", sales: 14, total: "R$ 1,8M", gold: true },
  { pos: 2, name: "Carlos Eduardo", sales: 11, total: "R$ 1,2M" },
  { pos: 3, name: "Felipe Rocha", sales: 9, total: "R$ 980k" },
  { pos: 4, name: "Mariana Teixeira", sales: 7, total: "R$ 840k" },
];

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
  const [, m, d] = iso.split("-");
  const base = `${d} de ${MONTHS[Number(m) - 1]}`;
  if (iso === TODAY) return `Hoje · ${base}`;
  if (iso === TOMORROW) return `Amanhã · ${base}`;
  return base;
}
