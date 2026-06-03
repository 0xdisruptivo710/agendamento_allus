/* ------------------------------------------------------------------ */
/* Mapping between the Supabase "Agendamento_Allus" table and the       */
/* panel's Appointment type. The automation fills Nome/Número/Data/     */
/* Confirmação; the panel owns the sales columns added by migration.    */
/* ------------------------------------------------------------------ */

import { STATUSES, TIPOS, type Appointment, type Status, type Tipo } from "@/components/painel/data";

export interface AllusRow {
  id: number;
  Nome: string | null;
  "Número": string | null;
  Data: string | null; // "dd/MM/yyyy HH:mm"
  "Confirmação": string | null;
  Cancelado: string | null;
  Cancelamento: string | null;
  Valor: number | null;
  "Responsável Atendimento": string | null;
  Tipo: string | null;
  "Anotações": string | null;
  "Veículo": string | null;
  "Test Drive": boolean | null;
  Compareceu: boolean | null;
  Qualificado: boolean | null;
  Status: string | null;
}

/** "02/06/2026 08:30" -> { date: "2026-06-02", time: "08:30" } */
export function parseBrDateTime(s: string | null): { date: string; time: string } {
  if (!s) return { date: "", time: "" };
  const [datePart, timePart = ""] = s.trim().split(/\s+/);
  const parts = datePart.split("/");
  if (parts.length !== 3) return { date: "", time: timePart.slice(0, 5) };
  const [d, mo, y] = parts;
  return { date: `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}`, time: timePart.slice(0, 5) };
}

function deriveStatus(row: AllusRow): Status {
  if (row.Status && (STATUSES as string[]).includes(row.Status)) return row.Status as Status;
  if (row.Cancelado || row.Cancelamento) return "Cancelado";
  if (row.Compareceu === true) return "Compareceu";
  if (row.Compareceu === false) return "Não compareceu";
  if ((row["Confirmação"] ?? "").toUpperCase().includes("OK")) return "Confirmado";
  return "Agendado";
}

export function rowToAppointment(row: AllusRow): Appointment {
  const { date, time } = parseBrDateTime(row.Data);
  const tipo: Tipo = (TIPOS as string[]).includes(row.Tipo ?? "") ? (row.Tipo as Tipo) : "Visita";
  return {
    id: String(row.id),
    date,
    time,
    name: row.Nome?.trim() || "Sem nome",
    phone: row["Número"] ?? "",
    vehicle: row["Veículo"] ?? "",
    tipo,
    seller: row["Responsável Atendimento"] ?? "",
    status: deriveStatus(row),
    compareceu: row.Compareceu === true,
    testDrive: row["Test Drive"] === true,
    qualificado: row.Qualificado === true,
    observacoes: row["Anotações"] ?? "",
    valor: typeof row.Valor === "number" ? row.Valor : 0,
  };
}

/** Only the sales columns the panel is allowed to write back. */
export function appointmentToRow(a: Appointment): Record<string, unknown> {
  return {
    Tipo: a.tipo,
    Status: a.status,
    "Responsável Atendimento": a.seller || null,
    "Veículo": a.vehicle || null,
    Compareceu: a.compareceu,
    "Test Drive": a.testDrive,
    Qualificado: a.qualificado,
    "Anotações": a.observacoes || null,
    Valor: a.valor || null,
  };
}
