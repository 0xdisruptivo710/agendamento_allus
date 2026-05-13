import { useState } from "react";
import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useProcedimentos } from "@/hooks/useProcedimentos";

interface ProcedimentoComboboxProps {
  value: string;
  onChange: (value: string) => void;
}

export function ProcedimentoCombobox({ value, onChange }: ProcedimentoComboboxProps) {
  const [open, setOpen] = useState(false);
  const { list: procedimentos } = useProcedimentos();

  return (
    <Popover open={open} onOpenChange={setOpen}>
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
            <CommandInput placeholder="Pesquisar procedimento..." className="border-0 focus:ring-0" />
          </div>
          <CommandList className="max-h-64">
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
        </Command>
      </PopoverContent>
    </Popover>
  );
}
