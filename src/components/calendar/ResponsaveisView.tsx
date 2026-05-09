import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, UserCog, Stethoscope, Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useResponsaveis, type TipoResponsavel, type Responsavel } from "@/hooks/useResponsaveis";
import { toast } from "sonner";

function Section({
  title,
  icon: Icon,
  tipo,
  items,
  onAdd,
  onRemove,
  onUpdate,
}: {
  title: string;
  icon: typeof UserCog;
  tipo: TipoResponsavel;
  items: Responsavel[];
  onAdd: (nome: string, tipo: TipoResponsavel) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, nome: string) => void;
}) {
  const [nome, setNome] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleAdd = () => {
    if (!nome.trim()) {
      toast.error("Informe um nome");
      return;
    }
    onAdd(nome, tipo);
    setNome("");
    toast.success("Responsável adicionado");
  };

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-5 w-5 text-green-400" />
        <h3 className="text-base font-bold text-foreground">{title}</h3>
        <span className="ml-auto text-xs text-muted-foreground">{items.length}</span>
      </div>

      <div className="mb-4 flex gap-2">
        <Input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Nome do responsável"
          className="border-border bg-secondary/50"
        />
        <Button onClick={handleAdd} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {items.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">Nenhum responsável cadastrado</p>
        )}
        {items.map((r) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-xl border border-border bg-secondary/30 px-3 py-2"
          >
            {editingId === r.id ? (
              <>
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onUpdate(r.id, editValue);
                      setEditingId(null);
                    }
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  autoFocus
                  className="h-8 border-border bg-background"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => {
                    onUpdate(r.id, editValue);
                    setEditingId(null);
                  }}
                >
                  <Check className="h-4 w-4 text-green-400" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditingId(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <span className="flex-1 text-sm font-medium text-foreground">{r.nome}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => {
                    setEditingId(r.id);
                    setEditValue(r.nome);
                  }}
                >
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => {
                    onRemove(r.id);
                    toast.success("Removido");
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function ResponsaveisView() {
  const { agendamento, atendimento, add, remove, update } = useResponsaveis();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Section
        title="Responsáveis pelo Agendamento"
        icon={UserCog}
        tipo="agendamento"
        items={agendamento}
        onAdd={add}
        onRemove={remove}
        onUpdate={update}
      />
      <Section
        title="Responsáveis pelo Atendimento"
        icon={Stethoscope}
        tipo="atendimento"
        items={atendimento}
        onAdd={add}
        onRemove={remove}
        onUpdate={update}
      />
    </div>
  );
}
