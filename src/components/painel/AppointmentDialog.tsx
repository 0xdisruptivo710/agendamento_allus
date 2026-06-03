import { useEffect, useState } from "react";
import { Car, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar } from "./shared";
import {
  formatDayLabel,
  SELLERS,
  STATUSES,
  TIPOS,
  type Appointment,
  type Status,
  type Tipo,
} from "./data";

interface Props {
  appointment: Appointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updated: Appointment) => void;
}

export function AppointmentDialog({ appointment, open, onOpenChange, onSave }: Props) {
  const [draft, setDraft] = useState<Appointment | null>(appointment);

  // Re-sync the local draft whenever a different appointment is opened.
  useEffect(() => {
    setDraft(appointment);
  }, [appointment]);

  if (!draft) return null;

  const set = <K extends keyof Appointment>(key: K, value: Appointment[K]) =>
    setDraft((d) => (d ? { ...d, [key]: value } : d));

  const handleSave = () => {
    onSave(draft);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading">{draft.name}</DialogTitle>
          <DialogDescription>
            {formatDayLabel(draft.date)} · {draft.time}
          </DialogDescription>
        </DialogHeader>

        {/* Context */}
        <div className="grid gap-3 rounded-xl border border-border bg-background/50 p-4">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Car className="h-4 w-4 text-primary" />
            <span className="font-medium">{draft.vehicle}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            {draft.phone}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Avatar name={draft.seller} className="h-6 w-6 text-[9px]" />
            <span>{draft.seller}</span>
          </div>
        </div>

        {/* Editable fields */}
        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Tipo</Label>
              <Select value={draft.tipo} onValueChange={(v) => set("tipo", v as Tipo)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TIPOS.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Status</Label>
              <Select value={draft.status} onValueChange={(v) => set("status", v as Status)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label>Vendedor responsável</Label>
            <Select value={draft.seller} onValueChange={(v) => set("seller", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {SELLERS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Toggles */}
          <div className="grid gap-1 rounded-xl border border-border p-1">
            <ToggleRow label="Cliente compareceu" checked={draft.compareceu} onChange={(v) => set("compareceu", v)} />
            <ToggleRow label="Fez test drive" checked={draft.testDrive} onChange={(v) => set("testDrive", v)} />
            <ToggleRow label="Cliente qualificado" checked={draft.qualificado} onChange={(v) => set("qualificado", v)} />
          </div>

          <div className="grid gap-1.5">
            <Label>Valor da venda (R$)</Label>
            <Input
              type="number"
              min={0}
              step={100}
              value={draft.valor || ""}
              onChange={(e) => set("valor", e.target.value === "" ? 0 : Math.max(0, Number(e.target.value) || 0))}
              placeholder="0"
            />
            <p className="text-xs text-muted-foreground">Usado no faturamento e no ranking quando o status for Concluído.</p>
          </div>

          <div className="grid gap-1.5">
            <Label>Observações</Label>
            <Textarea
              value={draft.observacoes}
              onChange={(e) => set("observacoes", e.target.value)}
              placeholder="Anote detalhes da negociação, interesse, próximos passos..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-muted/60">
      <Label className="cursor-pointer font-normal text-foreground">{label}</Label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
