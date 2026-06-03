import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { ranking } from "./data";
import { Avatar } from "./shared";

export function Ranking() {
  return (
    <div className="glass-card flex h-full flex-col rounded-xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-heading text-lg font-semibold text-foreground">Ranking de Vendas</h3>
          <p className="text-sm text-muted-foreground">Faturamento por vendedor</p>
        </div>
        <Trophy className="h-6 w-6 text-amber-500" />
      </div>

      <div className="flex flex-1 flex-col space-y-4">
        {ranking.map((r) => (
          <div
            key={r.name}
            className={cn(
              "relative flex items-center overflow-hidden rounded-xl p-3",
              r.gold
                ? "border border-amber-100 bg-gradient-to-r from-amber-50 to-transparent"
                : r.pos <= 3
                  ? "border border-border bg-background/40"
                  : "opacity-75",
            )}
          >
            {r.gold && <div className="absolute bottom-0 left-0 top-0 w-1 bg-amber-400" />}
            <div
              className={cn(
                "ml-2 w-6 font-heading font-bold",
                r.gold ? "text-xl text-amber-600" : r.pos === 3 ? "text-orange-400" : "text-muted-foreground",
              )}
            >
              {r.pos}
            </div>
            <Avatar name={r.name} className={cn("mx-3 h-10 w-10 text-xs", r.gold && "ring-2 ring-amber-400")} />
            <div className="min-w-0 flex-1">
              <h4 className={cn("truncate text-sm text-foreground", r.gold ? "font-bold" : "font-semibold")}>{r.name}</h4>
              <p className="text-xs text-muted-foreground">{r.sales} vendas</p>
            </div>
            <p className={cn("text-sm text-foreground", r.gold ? "font-bold" : "font-semibold")}>{r.total}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
