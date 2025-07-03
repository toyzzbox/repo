"use client";

import * as React from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { id: "1", name: "Appliances > Irons" },
  { id: "2", name: "Appliances > Kettles" },
  { id: "3", name: "Appliances > Microwaves" },
  { id: "4", name: "Appliances > Refrigerators" },
];

export default function MultiSelectDropdown() {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string[]>([]);

  const toggleCategory = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-[300px]">
      <div
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center justify-between border rounded px-3 py-2 cursor-pointer",
          open && "ring-2 ring-ring"
        )}
      >
        <span className="text-sm text-muted-foreground">
          {selected.length > 0
            ? `${selected.length} kategori seçildi`
            : "Kategori seçin"}
        </span>
        <ChevronDown className="h-4 w-4" />
      </div>

      {open && (
        <div className="mt-2 border rounded bg-white shadow-md max-h-60 overflow-auto z-50">
          <Command>
            <CommandInput placeholder="Kategori ara..." />
            <CommandEmpty>Sonuç bulunamadı.</CommandEmpty>
            <CommandGroup>
              {categories.map((category) => (
                <CommandItem
                  key={category.id}
                  onSelect={() => toggleCategory(category.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected.includes(category.id)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {category.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </div>
      )}

      {/* Seçilen kategorileri altta göster */}
      <div className="mt-4 space-y-2">
        {selected.map((id) => {
          const cat = categories.find((c) => c.id === id);
          return (
            <div
              key={id}
              className="border p-2 rounded bg-gray-50 text-sm"
            >
              {cat?.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}
