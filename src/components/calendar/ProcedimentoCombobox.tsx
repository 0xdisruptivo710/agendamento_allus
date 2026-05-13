import { useState } from "react";
import { Check, ChevronsUpDown, Loader2, Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useAddProcedimento, useProcedimentos } from "@/hooks/useProcedimentos";

interface ProcedimentoComboboxProps {
  value: string;
  onChange: (value: string) => void;
}

export function ProcedimentoCombobox({ value, onChange }: ProcedimentoComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { list: procedimentos } = useProcedimentos();
  const { mutateAsync: addProcedimento, isPending: adding } = useAddProcedimento();

  const trimmed = search.trim();
  const hasExactMatch = trimmed.length > 0 && procedimentos.some((p) => p.toLowerCase() === trimmed.toLowerCase());
  const canAdd = trimmed.length > 0 && !hasExactMatch && !adding;

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setSearch("");
  };

  const handleAdd = async () => {
    if (!canAdd) return;
    try {
      const novo = await addProcedimento(trimmed);
      onChange(novo);
      setSearch("");
      setOpen(false);
    } catch {
      // erro silencioso — UI mantém estado, usuário pode tentar de novo
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between border-border bg-secondary/50 font-normal"
        >
          <span className={cn("truncate text-left", !value && "text-muted-foreground")}>
            {value || "Selecione um procedimento..."}
          </span>
          <div className="flex items-center gap-1">
            {value && (
              <X
                className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange("");
                }}
              />
            )}
            <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Pesquisar ou adicionar..."
              className="border-0 focus:ring-0"
              value={search}
              onValueChange={setSearch}
            />
          </div>
          <CommandList
            className="max-h-64 overflow-y-auto overscroll-contain"
            onWheel={(e) => {
              e.currentTarget.scrollTop += e.deltaY;
            }}
          >
            <CommandEmpty>Nenhum procedimento encontrado.</CommandEmpty>
            <CommandGroup>
              {procedimentos.map((proc) => (
                <CommandItem
                  key={proc}
                  value={proc}
                  onSelect={() => {
                    onChange(proc === value ? "" : proc);
                    setOpen(false);
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === proc ? "opacity-100" : "opacity-0")} />
                  {proc}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          {canAdd && (
            <div className="border-t border-border p-1">
              <button
                type="button"
                onClick={handleAdd}
                disabled={adding}
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm text-primary hover:bg-accent hover:text-accent-foreground disabled:opacity-60"
              >
                {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                <span className="truncate">Adicionar "{trimmed}"</span>
              </button>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
