"use client";

import * as React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultiSelectProps {
  items: { id: string; name: string }[];
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
  placeholder?: string;
  label?: string;
}

export default function MultiSelect({
  items,
  selected,
  setSelected,
  placeholder = "Ara...",
  label,
}: MultiSelectProps) {
  const [query, setQuery] = React.useState("");

  const toggleItem = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const removeItem = (id: string) => {
    setSelected((prev) => prev.filter((item) => item !== id));
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-2">
      {label && <label className="font-medium">{label}</label>}

      <Command>
        <CommandInput placeholder={placeholder} onValueChange={setQuery} />
        <CommandEmpty>Sonuç bulunamadı.</CommandEmpty>
        <CommandGroup className="max-h-60 overflow-y-auto">
          {filteredItems.map((item) => (
            <CommandItem key={item.id} onSelect={() => toggleItem(item.id)}>
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  selected.includes(item.id) ? "opacity-100" : "opacity-0"
                )}
              />
              {item.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </Command>

      {/* Seçilenleri göster */}
      <div className="space-y-1">
        {selected.map((id) => {
          const current = items.find((i) => i.id === id);
          return (
            <div
              key={id}
              className="flex items-center justify-between border p-2 rounded bg-gray-50 text-sm"
            >
              <span>{current?.name}</span>
              <button
                type="button"
                onClick={() => removeItem(id)}
                className="text-gray-400 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
