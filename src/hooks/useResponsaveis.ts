import { useCallback, useEffect, useState } from "react";

export type TipoResponsavel = "agendamento" | "atendimento";

const STORAGE_KEY = "drcolageno_responsaveis_v1";

export interface Responsavel {
  id: string;
  nome: string;
  tipo: TipoResponsavel;
}

function read(): Responsavel[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Responsavel[];
  } catch {
    return [];
  }
}

function write(list: Responsavel[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("responsaveis:changed"));
}

export function useResponsaveis() {
  const [list, setList] = useState<Responsavel[]>(() => read());

  useEffect(() => {
    const sync = () => setList(read());
    window.addEventListener("responsaveis:changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("responsaveis:changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const add = useCallback((nome: string, tipo: TipoResponsavel) => {
    const trimmed = nome.trim();
    if (!trimmed) return;
    const current = read();
    if (current.some((r) => r.nome.toLowerCase() === trimmed.toLowerCase() && r.tipo === tipo)) return;
    const next = [...current, { id: crypto.randomUUID(), nome: trimmed, tipo }];
    write(next);
  }, []);

  const remove = useCallback((id: string) => {
    write(read().filter((r) => r.id !== id));
  }, []);

  const update = useCallback((id: string, nome: string) => {
    const trimmed = nome.trim();
    if (!trimmed) return;
    write(read().map((r) => (r.id === id ? { ...r, nome: trimmed } : r)));
  }, []);

  return {
    all: list,
    agendamento: list.filter((r) => r.tipo === "agendamento"),
    atendimento: list.filter((r) => r.tipo === "atendimento"),
    add,
    remove,
    update,
  };
}
