import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { initials, statusMeta, type Status } from "./data";

export function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-semibold text-primary",
        className,
      )}
    >
      {initials(name)}
    </div>
  );
}

/** Yes/No indicator. `danger` makes the "Não" state red (used for no-shows). */
export function Indicator({ ok, danger = false }: { ok: boolean; danger?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium",
        ok
          ? "bg-emerald-50 text-emerald-700"
          : danger
            ? "bg-red-50 text-red-600"
            : "bg-muted text-muted-foreground",
      )}
    >
      {ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
      {ok ? "Sim" : "Não"}
    </span>
  );
}

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium",
        statusMeta[status],
        className,
      )}
    >
      {status}
    </span>
  );
}
