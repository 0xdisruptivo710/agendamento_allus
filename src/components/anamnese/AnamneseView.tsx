import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ClipboardList, Plus, Search, Pencil, Trash2 } from "lucide-react";
import { useAnamneses, useDeleteAnamnese, type Anamnese } from "@/hooks/useAnamneses";
import { AnamneseFormDialog } from "./AnamneseFormDialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

export function AnamneseView() {
  const { data: list = [], isLoading } = useAnamneses();
  const del = useDeleteAnamnese();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Anamnese | null>(null);

  const filtered = useMemo(() => {
    const s = search.toLowerCase().trim();
    if (!s) return list;
    return list.filter((a) => (a.paciente_nome || "").toLowerCase().includes(s));
  }, [list, search]);

  const handleDelete = async (id: number) => {
    if (!confirm("Excluir esta anamnese?")) return;
    try {
      await del.mutateAsync(id);
      toast.success("Anamnese excluída");
    } catch {
      toast.error("Erro ao excluir");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold gradient-text">Anamneses</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar paciente..." className="pl-8 bg-secondary/50 sm:w-64" />
          </div>
          <Button onClick={() => { setEditing(null); setOpen(true); }} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" /> Nova anamnese
          </Button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : filtered.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 text-center">
          <ClipboardList className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Nenhuma anamnese cadastrada ainda.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="glass-card rounded-2xl p-4">
              <div className="mb-2 flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-foreground">{a.paciente_nome || "Sem nome"}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {a.data_anamnese ? format(new Date(a.data_anamnese + "T00:00:00"), "dd 'de' MMMM yyyy", { locale: ptBR }) : "—"}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditing(a); setOpen(true); }}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDelete(a.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              {a.queixa_principal && <p className="line-clamp-3 text-xs text-foreground/80">{a.queixa_principal}</p>}
            </motion.div>
          ))}
        </div>
      )}

      <AnamneseFormDialog open={open} onOpenChange={setOpen} initial={editing} />
    </div>
  );
}
