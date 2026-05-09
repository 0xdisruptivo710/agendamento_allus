import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { type Anamnese, useUpsertAnamnese } from "@/hooks/useAnamneses";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initial?: Partial<Anamnese> | null;
  agendamentoId?: number | null;
  pacienteNome?: string | null;
}

const empty: Partial<Anamnese> = {
  paciente_nome: "",
  data_anamnese: new Date().toISOString().slice(0, 10),
  queixa_principal: "",
  historico_saude: "",
  alergias: "",
  medicamentos: "",
  cirurgias_previas: "",
  gestante: false,
  procedimentos_anteriores: "",
  tabagismo: false,
  etilismo: false,
  tipo_pele: "",
  exposicao_solar: "",
  observacoes: "",
};

export function AnamneseFormDialog({ open, onOpenChange, initial, agendamentoId, pacienteNome }: Props) {
  const [form, setForm] = useState<Partial<Anamnese>>(empty);
  const upsert = useUpsertAnamnese();

  useEffect(() => {
    if (open) {
      setForm({
        ...empty,
        ...(initial || {}),
        paciente_nome: initial?.paciente_nome || pacienteNome || "",
        agendamento_id: initial?.agendamento_id ?? agendamentoId ?? null,
      });
    }
  }, [open, initial, agendamentoId, pacienteNome]);

  const set = <K extends keyof Anamnese>(k: K, v: Anamnese[K]) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.paciente_nome?.trim()) {
      toast.error("Informe o nome do paciente");
      return;
    }
    try {
      await upsert.mutateAsync(form);
      toast.success("Anamnese salva!");
      onOpenChange(false);
    } catch (e: any) {
      toast.error("Erro ao salvar: " + (e?.message || ""));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-border bg-popover">
        <DialogHeader>
          <DialogTitle className="gradient-text">{initial?.id ? "Editar anamnese" : "Nova anamnese"}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs font-semibold">Paciente</Label>
            <Input value={form.paciente_nome || ""} onChange={(e) => set("paciente_nome", e.target.value)} className="bg-secondary/50" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Data</Label>
            <Input type="date" value={form.data_anamnese || ""} onChange={(e) => set("data_anamnese", e.target.value)} className="bg-secondary/50" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Tipo de pele</Label>
            <Input value={form.tipo_pele || ""} onChange={(e) => set("tipo_pele", e.target.value)} placeholder="Oleosa, mista, seca..." className="bg-secondary/50" />
          </div>

          <Field label="Queixa principal" sm value={form.queixa_principal} onChange={(v) => set("queixa_principal", v)} />
          <Field label="Histórico de saúde" sm value={form.historico_saude} onChange={(v) => set("historico_saude", v)} />
          <Field label="Alergias" sm value={form.alergias} onChange={(v) => set("alergias", v)} />
          <Field label="Medicamentos em uso" sm value={form.medicamentos} onChange={(v) => set("medicamentos", v)} />
          <Field label="Cirurgias prévias" sm value={form.cirurgias_previas} onChange={(v) => set("cirurgias_previas", v)} />
          <Field label="Procedimentos estéticos anteriores" sm value={form.procedimentos_anteriores} onChange={(v) => set("procedimentos_anteriores", v)} />
          <Field label="Exposição solar" sm value={form.exposicao_solar} onChange={(v) => set("exposicao_solar", v)} />

          <div className="flex items-center justify-between rounded-md border border-border bg-secondary/30 p-3">
            <Label className="text-xs font-semibold">Gestante / amamentando</Label>
            <Switch checked={!!form.gestante} onCheckedChange={(v) => set("gestante", v)} />
          </div>
          <div className="flex items-center justify-between rounded-md border border-border bg-secondary/30 p-3">
            <Label className="text-xs font-semibold">Tabagismo</Label>
            <Switch checked={!!form.tabagismo} onCheckedChange={(v) => set("tabagismo", v)} />
          </div>
          <div className="flex items-center justify-between rounded-md border border-border bg-secondary/30 p-3">
            <Label className="text-xs font-semibold">Etilismo</Label>
            <Switch checked={!!form.etilismo} onCheckedChange={(v) => set("etilismo", v)} />
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <Label className="text-xs font-semibold">Observações</Label>
            <Textarea value={form.observacoes || ""} onChange={(e) => set("observacoes", e.target.value)} className="min-h-[80px] bg-secondary/50" />
          </div>
        </div>

        <Button onClick={handleSave} disabled={upsert.isPending} className="mt-3 w-full bg-primary text-primary-foreground font-bold hover:bg-primary/90">
          <Save className="mr-2 h-4 w-4" /> {upsert.isPending ? "Salvando..." : "Salvar anamnese"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, value, onChange, sm }: { label: string; value?: string | null; onChange: (v: string) => void; sm?: boolean }) {
  return (
    <div className={`space-y-1.5 ${sm ? "" : "sm:col-span-2"}`}>
      <Label className="text-xs font-semibold">{label}</Label>
      <Textarea value={value || ""} onChange={(e) => onChange(e.target.value)} className="min-h-[60px] bg-secondary/50" />
    </div>
  );
}
