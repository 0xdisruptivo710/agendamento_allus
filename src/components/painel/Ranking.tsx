import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatBRL, sellerStats, type Appointment } from "./data";
import { Avatar } from "./shared";

export function Ranking({ appointments }: { appointments: Appointment[] }) {
  const stats = sellerStats(appointments);

  return (
    <div className="glass-card flex h-full flex-col rounded-xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-heading text-lg font-semibold text-foreground">Ranking de Vendas</h3>
          <p className="text-sm text-muted-foreground">Faturamento por vendedor</p>
        </div>
        <Trophy className="h-6 w-6 text-amber-500" />
      </div>

      {stats.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-1 py-8 text-center text-muted-foreground">
          <Trophy className="h-7 w-7 opacity-30" />
          <p className="text-sm">Nenhuma venda registrada ainda.</p>
          <p className="text-xs">Marque um agendamento como <span className="font-medium">Concluído</span> e informe o valor.</p>
        </div>
      ) : (
        <div className="flex flex-1 flex-col space-y-4">
          {stats.map((r, i) => {
            const pos = i + 1;
            const gold = i === 0;
            return (
              <div
                key={r.name}
                className={cn(
                  "relative flex items-center overflow-hidden rounded-xl p-3",
                  gold
                    ? "border border-amber-100 bg-gradient-to-r from-amber-50 to-transparent"
                    : "border border-border bg-background/40",
                )}
              >
                {gold && <div className="absolute bottom-0 left-0 top-0 w-1 bg-amber-400" />}
                <div
                  className={cn(
                    "ml-2 w-6 font-heading font-bold",
                    gold ? "text-xl text-amber-600" : pos === 3 ? "text-orange-400" : "text-muted-foreground",
                  )}
                >
                  {pos}
                </div>
                <Avatar name={r.name} className={cn("mx-3 h-10 w-10 text-xs", gold && "ring-2 ring-amber-400")} />
                <div className="min-w-0 flex-1">
                  <h4 className={cn("truncate text-sm text-foreground", gold ? "font-bold" : "font-semibold")}>{r.name}</h4>
                  <p className="text-xs text-muted-foreground">{r.vendas} {r.vendas === 1 ? "venda" : "vendas"}</p>
                </div>
                <p className={cn("text-sm text-foreground", gold ? "font-bold" : "font-semibold")}>{formatBRL(r.faturamento)}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
