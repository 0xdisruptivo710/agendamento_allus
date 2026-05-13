import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Trash2, Download, CheckCircle, Save, Calendar as CalIcon, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  type Acompanhamento,
  useAcompanhamentoFotos,
  useDeleteFoto,
  useUploadFoto,
  useUpsertAcompanhamento,
} from "@/hooks/useAcompanhamentos";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  acompanhamento: Acompanhamento | null;
}

export function AcompanhamentoDetailDialog({ open, onOpenChange, acompanhamento }: Props) {
  const { data: fotos = [] } = useAcompanhamentoFotos(acompanhamento?.id ?? null);
  const upload = useUploadFoto();
  const delFoto = useDeleteFoto();
  const upsert = useUpsertAcompanhamento();
  const fileRef = useRef<HTMLInputElement>(null);

  const [dataFim, setDataFim] = useState("");
  const [obs, setObs] = useState("");
  const [status, setStatus] = useState("em_andamento");

  useEffect(() => {
    if (acompanhamento) {
      setDataFim(acompanhamento.data_fim_tratamento || "");
      setObs(acompanhamento.observacoes || "");
      setStatus(acompanhamento.status || "em_andamento");
    }
  }, [acompanhamento]);

  if (!acompanhamento) return null;

  const handleFiles = async (files: FileList | null) => {
    if (!files || !acompanhamento) return;
    for (const f of Array.from(files)) {
      try {
        await upload.mutateAsync({ acompanhamentoId: acompanhamento.id, file: f });
      } catch (e: any) {
        toast.error("Erro no upload: " + (e?.message || ""));
        return;
      }
    }
    toast.success("Foto(s) enviada(s)!");
  };

  const handleSave = async () => {
    try {
      await upsert.mutateAsync({ id: acompanhamento.id, data_fim_tratamento: dataFim || null, observacoes: obs, status });
      toast.success("Acompanhamento salvo!");
    } catch (e: any) {
      toast.error("Erro ao salvar: " + (e?.message || ""));
    }
  };

  const handleMarkSent = async () => {
    try {
      await upsert.mutateAsync({ id: acompanhamento.id, status: "enviado" });
      setStatus("enviado");
      toast.success("Marcado como enviado");
    } catch {
      toast.error("Erro");
    }
  };

  const downloadComparativo = async () => {
    if (fotos.length < 2) {
      toast.error("Necessárias ao menos 2 fotos para o comparativo.");
      return;
    }
    const first = fotos[0];
    const last = fotos[fotos.length - 1];
    try {
      const [imgA, imgB] = await Promise.all([loadImage(first.foto_url), loadImage(last.foto_url)]);
      const W = 1600;
      const H = 1000;
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, W, H);

      drawCover(ctx, imgA, 20, 100, W / 2 - 30, H - 140);
      drawCover(ctx, imgB, W / 2 + 10, 100, W / 2 - 30, H - 140);

      ctx.fillStyle = "#86efac";
      ctx.font = "bold 28px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Aios Clinics Itupeva — Antes e Depois", W / 2, 50);
      ctx.font = "bold 22px sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(acompanhamento.paciente_nome || "Paciente", W / 2, 82);

      ctx.font = "600 20px sans-serif";
      ctx.fillStyle = "#86efac";
      ctx.fillText(`ANTES — ${first.data_foto || ""}`, W / 4, H - 20);
      ctx.fillText(`DEPOIS — ${last.data_foto || ""}`, (3 * W) / 4, H - 20);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `comparativo-${(acompanhamento.paciente_nome || "paciente").replace(/\s+/g, "_")}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }, "image/png");
    } catch (e: any) {
      toast.error("Erro ao gerar comparativo: " + (e?.message || ""));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-border bg-popover">
        <DialogHeader>
          <DialogTitle className="gradient-text">Acompanhamento — {acompanhamento.paciente_nome || "Paciente"}</DialogTitle>
          {acompanhamento.paciente_telefone && (
            <p className="text-xs text-primary">📱 {acompanhamento.paciente_telefone}</p>
          )}
        </DialogHeader>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label className="flex items-center gap-2 text-xs font-semibold"><CalIcon className="h-3.5 w-3.5 text-green-400" /> Início</Label>
            <Input value={acompanhamento.data_inicio || ""} disabled className="bg-secondary/30" />
          </div>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-2 text-xs font-semibold"><CalIcon className="h-3.5 w-3.5 text-green-400" /> Fim previsto</Label>
            <Input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} className="bg-secondary/50" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Status</Label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="flex h-10 w-full rounded-md border border-border bg-secondary/50 px-3 text-sm">
              <option value="em_andamento">Em andamento</option>
              <option value="pronto_envio">Pronto para envio</option>
              <option value="enviado">Enviado</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Observações</Label>
          <Textarea value={obs} onChange={(e) => setObs(e.target.value)} className="min-h-[60px] bg-secondary/50" />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={handleSave} disabled={upsert.isPending} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Save className="mr-2 h-4 w-4" /> Salvar
          </Button>
          <Button onClick={() => fileRef.current?.click()} variant="outline">
            <Upload className="mr-2 h-4 w-4" /> Adicionar foto
          </Button>
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
          <Button onClick={downloadComparativo} variant="outline" disabled={fotos.length < 2}>
            <Download className="mr-2 h-4 w-4" /> Baixar antes/depois
          </Button>
          <Button onClick={handleMarkSent} variant="outline">
            <CheckCircle className="mr-2 h-4 w-4" /> Marcar enviado
          </Button>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold text-foreground">Fotos ({fotos.length})</h4>
          {fotos.length === 0 ? (
            <div className="glass-card rounded-2xl p-6 text-center text-sm text-muted-foreground">
              <ImageIcon className="mx-auto mb-2 h-8 w-8" /> Nenhuma foto ainda.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {fotos.map((f) => (
                <div key={f.id} className="group relative overflow-hidden rounded-xl border border-border">
                  <img src={f.foto_url} alt="" className="aspect-square w-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/60 px-2 py-1 text-[10px] text-white">
                    <span>{f.data_foto ? format(new Date(f.data_foto + "T00:00:00"), "dd/MM/yy", { locale: ptBR }) : ""}</span>
                    <button onClick={() => delFoto.mutate(f)} className="text-destructive hover:text-red-400"><Trash2 className="h-3 w-3" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const ratio = Math.max(w / img.width, h / img.height);
  const nw = img.width * ratio;
  const nh = img.height * ratio;
  const nx = x + (w - nw) / 2;
  const ny = y + (h - nh) / 2;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.drawImage(img, nx, ny, nw, nh);
  ctx.restore();
}
