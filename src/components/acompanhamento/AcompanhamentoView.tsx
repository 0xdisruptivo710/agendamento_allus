import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Camera, Plus, Search, AlertTriangle, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import {
  type Acompanhamento,
  useAcompanhamentos,
  useDeleteAcompanhamento,
  useUpsertAcompanhamento,
} from "@/hooks/useAcompanhamentos";
import { AcompanhamentoDetailDialog } from "./AcompanhamentoDetailDialog";

export function AcompanhamentoView() {
  const { data: list = [], isLoading } = useAcompanhamentos();
  const upsert = useUpsertAcompanhamento();
  const del = useDeleteAcompanhamento();
  const [search, setSearch] = useState("");
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [selected, setSelected] = useState<Acompanhamento | null>(null);
  const [open, setOpen] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  const filtered = useMemo(() => {
    const s = search.toLowerCase().trim();
    if (!s) return list;
    return list.filter((a) => (a.paciente_nome || "").toLowerCase().includes(s));
  }, [list, search]);

  const handleCreate = async () => {
    if (!newName.trim()) {
      toast.error("Informe o nome do paciente");
      return;
    }
    try {
      const created = await upsert.mutateAsync({
        paciente_nome: newName.trim(),
        paciente_telefone: newPhone.trim() || null,
        data_inicio: today,
        status: "em_andamento",
      });
      setNewName("");
      setNewPhone("");
      toast.success("Acompanhamento criado!");
      if (created) {
        setSelected(created);
        setOpen(true);
      }
    } catch (e: any) {
      toast.error("Erro: " + (e?.message || ""));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Excluir este acompanhamento e todas as fotos?")) return;
    try {
      await del.mutateAsync(id);
      toast.success("Excluído");
    } catch {
      toast.error("Erro ao excluir");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold gradient-text">Acompanhamentos</h2>
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar paciente..." className="pl-8 bg-secondary/50 sm:w-64" />
        </div>
      </div>

      <div className="glass-card flex flex-col gap-2 rounded-2xl p-4 sm:flex-row sm:items-center">
        <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nome do paciente" className="bg-secondary/50" />
        <Input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="Telefone" className="bg-secondary/50 sm:w-52" />
        <Button onClick={handleCreate} disabled={upsert.isPending} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Criar
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : filtered.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 text-center">
          <Camera className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Nenhum acompanhamento ainda.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a, i) => {
            const ready = a.data_fim_tratamento && a.data_fim_tratamento <= today && a.status !== "enviado";
            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="glass-card cursor-pointer rounded-2xl p-4 hover:ring-1 hover:ring-primary/40"
                onClick={() => { setSelected(a); setOpen(true); }}
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-foreground">{a.paciente_nome || "Sem nome"}</p>
                    <p className="text-[11px] text-muted-foreground">
                      Início: {a.data_inicio ? format(new Date(a.data_inicio + "T00:00:00"), "dd/MM/yyyy", { locale: ptBR }) : "—"}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Fim: {a.data_fim_tratamento ? format(new Date(a.data_fim_tratamento + "T00:00:00"), "dd/MM/yyyy", { locale: ptBR }) : "—"}
                    </p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(a.id); }} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                {ready && (
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-yellow-400/10 px-2 py-1 text-[10px] font-bold text-yellow-400">
                    <AlertTriangle className="h-3 w-3" /> Pronto para envio
                  </div>
                )}
                {a.status === "enviado" && (
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-green-400/10 px-2 py-1 text-[10px] font-bold text-green-400">
                    Enviado
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      <AcompanhamentoDetailDialog open={open} onOpenChange={setOpen} acompanhamento={selected} />
    </div>
  );
}
