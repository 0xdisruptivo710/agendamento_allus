import { useMemo, useState } from "react";
import { addDays, addMonths, addWeeks, isToday, subDays, subMonths, subWeeks } from "date-fns";
import { motion } from "framer-motion";
import { AlertCircle, BarChart3, CalendarDays, Camera, CheckCircle, ClipboardList, Loader2, Users, UserCog } from "lucide-react";
import { AnamneseView } from "@/components/anamnese/AnamneseView";
import { AcompanhamentoView } from "@/components/acompanhamento/AcompanhamentoView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { DayView } from "@/components/calendar/DayView";
import { EventDetailDialog } from "@/components/calendar/EventDetailDialog";
import { MonthView } from "@/components/calendar/MonthView";
import { ReportsView } from "@/components/calendar/ReportsView";
import { ResponsaveisView } from "@/components/calendar/ResponsaveisView";
import { UpcomingAppointmentsPanel } from "@/components/calendar/UpcomingAppointmentsPanel";
import { WeekView } from "@/components/calendar/WeekView";
import { useAgendamentos, type Agendamento } from "@/hooks/useAgendamentos";
import { parseAgendamentoDate } from "@/lib/agendamento-date";

const Index = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [selectedEvent, setSelectedEvent] = useState<Agendamento | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: agendamentos, isLoading } = useAgendamentos();

  const handlePrev = () => {
    if (view === "month") setCurrentDate((d) => subMonths(d, 1));
    else if (view === "week") setCurrentDate((d) => subWeeks(d, 1));
    else setCurrentDate((d) => subDays(d, 1));
  };

  const handleNext = () => {
    if (view === "month") setCurrentDate((d) => addMonths(d, 1));
    else if (view === "week") setCurrentDate((d) => addWeeks(d, 1));
    else setCurrentDate((d) => addDays(d, 1));
  };

  const handleEventClick = (event: Agendamento) => {
    setSelectedEvent(event);
    const parsedDate = parseAgendamentoDate(event.Data);
    if (parsedDate) setCurrentDate(parsedDate);
    setDialogOpen(true);
  };

  const stats = useMemo(() => {
    if (!agendamentos) return { total: 0, today: 0, confirmed: 0, pending: 0 };

    const validDates = agendamentos.filter((a) => parseAgendamentoDate(a.Data));
    const today = validDates.filter((a) => {
      const parsed = parseAgendamentoDate(a.Data);
      return parsed ? isToday(parsed) : false;
    });
    const confirmed = agendamentos.filter((a) => {
      const status = a.Confirmação?.toLowerCase() || "";
      return status.includes("confirm") || status.includes("ok");
    });
    const pending = agendamentos.filter((a) => !a.Confirmação);

    return { total: agendamentos.length, today: today.length, confirmed: confirmed.length, pending: pending.length };
  }, [agendamentos]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: "Total", value: stats.total, icon: CalendarDays, color: "text-primary" },
            { label: "Hoje", value: stats.today, icon: Users, color: "text-green-400" },
            { label: "Confirmados", value: stats.confirmed, icon: CheckCircle, color: "text-emerald-400" },
            { label: "Pendentes", value: stats.pending, icon: AlertCircle, color: "text-dark-300" },
          ].map((stat) => (
            <div key={stat.label} className="glass-card flex items-center gap-3 rounded-2xl p-4">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{stat.label}</p>
                <p className={`text-xl font-extrabold ${stat.color}`}>{stat.value}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <Tabs defaultValue="agenda" className="w-full">
          <TabsList className="mb-4 bg-card border border-border">
            <TabsTrigger value="agenda" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <CalendarDays className="mr-2 h-4 w-4" /> Agenda
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BarChart3 className="mr-2 h-4 w-4" /> Relatórios
            </TabsTrigger>
            <TabsTrigger value="responsaveis" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <UserCog className="mr-2 h-4 w-4" /> Responsáveis
            </TabsTrigger>
            <TabsTrigger value="anamnese" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <ClipboardList className="mr-2 h-4 w-4" /> Anamnese
            </TabsTrigger>
            <TabsTrigger value="acompanhamento" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Camera className="mr-2 h-4 w-4" /> Acompanhamento
            </TabsTrigger>
          </TabsList>

          <TabsContent value="agenda" className="space-y-6 mt-0">
            <CalendarHeader
              currentDate={currentDate}
              view={view}
              onPrev={handlePrev}
              onNext={handleNext}
              onToday={() => setCurrentDate(new Date())}
              onViewChange={setView}
            />

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
              <motion.div key={`${view}-${currentDate.toISOString()}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                {view === "month" && <MonthView currentDate={currentDate} agendamentos={agendamentos || []} onEventClick={handleEventClick} onDayClick={(date) => { setCurrentDate(date); setView("day"); }} />}
                {view === "week" && <WeekView currentDate={currentDate} agendamentos={agendamentos || []} onEventClick={handleEventClick} />}
                {view === "day" && <DayView currentDate={currentDate} agendamentos={agendamentos || []} onEventClick={handleEventClick} />}
              </motion.div>

              <UpcomingAppointmentsPanel agendamentos={agendamentos || []} onEventClick={handleEventClick} />
            </div>
          </TabsContent>

          <TabsContent value="reports" className="mt-0">
            <ReportsView agendamentos={agendamentos || []} />
          </TabsContent>

          <TabsContent value="responsaveis" className="mt-0">
            <ResponsaveisView />
          </TabsContent>

          <TabsContent value="anamnese" className="mt-0">
            <AnamneseView />
          </TabsContent>

          <TabsContent value="acompanhamento" className="mt-0">
            <AcompanhamentoView />
          </TabsContent>
        </Tabs>

        <EventDetailDialog event={selectedEvent} open={dialogOpen} onOpenChange={setDialogOpen} />
      </div>
    </div>
  );
};

export default Index;
