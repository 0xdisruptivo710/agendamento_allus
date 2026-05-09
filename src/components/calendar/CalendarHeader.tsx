import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CalendarHeaderProps {
  currentDate: Date;
  view: "month" | "week" | "day";
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (view: "month" | "week" | "day") => void;
}

export function CalendarHeader({ currentDate, view, onPrev, onNext, onToday, onViewChange }: CalendarHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-6 h-6 text-green-400" />
          <h1 className="text-2xl font-bold gradient-text">Painel Agendamento</h1>
        </div>
        <span className="hidden sm:inline text-sm font-medium text-muted-foreground">|</span>
        <span className="hidden sm:inline text-sm font-semibold text-accent-foreground">Dr Colágeno Piracicaba</span>
        <h2 className="text-xl font-semibold text-foreground capitalize">
          {format(currentDate, view === "day" ? "dd 'de' MMMM, yyyy" : "MMMM yyyy", { locale: ptBR })}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onToday}
          className="border-border bg-card text-foreground hover:bg-primary/10 hover:border-primary/40 transition-all"
        >
          Hoje
        </Button>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrev}
            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onNext}
            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex glass-card rounded-lg overflow-hidden">
          {(["month", "week", "day"] as const).map((v) => (
            <button
              key={v}
              onClick={() => onViewChange(v)}
              className={`px-3 py-1.5 text-xs font-semibold transition-all capitalize ${
                view === v
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {v === "month" ? "Mês" : v === "week" ? "Semana" : "Dia"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
