import { useState } from "react";
import { BarChart3, CalendarDays, LayoutDashboard, Loader2, WifiOff } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgendaView } from "@/components/painel/AgendaView";
import { AppointmentDialog } from "@/components/painel/AppointmentDialog";
import { Relatorios } from "@/components/painel/Relatorios";
import { VisaoGeral } from "@/components/painel/VisaoGeral";
import type { Appointment } from "@/components/painel/data";
import { useAgendamentosAllus, useUpdateAgendamento } from "@/hooks/useAgendamentosAllus";

const Painel = () => {
  const { data: appointments = [], isLoading, isError, error } = useAgendamentosAllus();
  const updateMut = useUpdateAgendamento();
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSelect = (a: Appointment) => {
    setSelected(a);
    setDialogOpen(true);
  };

  const handleSave = (updated: Appointment) => {
    updateMut.mutate(updated);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-6 text-center">
        <WifiOff className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">Não foi possível carregar os agendamentos.</p>
        <p className="max-w-md text-xs text-muted-foreground">
          {error instanceof Error ? error.message : "Verifique a conexão com o Supabase."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-8 md:py-8">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight">Painel de Vendas</h1>
            <p className="text-sm text-muted-foreground">Allus Veículos</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            Junho de 2026
          </span>
        </header>

        <Tabs defaultValue="visao" className="w-full">
          <TabsList className="h-auto gap-1 rounded-full border border-border bg-card p-1">
            <TabsTrigger
              value="visao"
              className="rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground data-[state=active]:bg-secondary data-[state=active]:text-primary data-[state=active]:shadow-none"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" /> Visão Geral
            </TabsTrigger>
            <TabsTrigger
              value="agenda"
              className="rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground data-[state=active]:bg-secondary data-[state=active]:text-primary data-[state=active]:shadow-none"
            >
              <CalendarDays className="mr-2 h-4 w-4" /> Agenda
            </TabsTrigger>
            <TabsTrigger
              value="relatorios"
              className="rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground data-[state=active]:bg-secondary data-[state=active]:text-primary data-[state=active]:shadow-none"
            >
              <BarChart3 className="mr-2 h-4 w-4" /> Relatórios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visao" className="mt-6">
            <VisaoGeral appointments={appointments} onSelect={handleSelect} />
          </TabsContent>

          <TabsContent value="agenda" className="mt-6">
            <AgendaView appointments={appointments} onSelect={handleSelect} />
          </TabsContent>

          <TabsContent value="relatorios" className="mt-6">
            <Relatorios appointments={appointments} />
          </TabsContent>
        </Tabs>
      </div>

      <AppointmentDialog
        appointment={selected}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
      />
    </div>
  );
};

export default Painel;
