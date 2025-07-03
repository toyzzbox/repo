"use client";

import * as React from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { id: "1", name: "Appliances > Irons" },
  { id: "2", name: "Appliances > Kettles" },
  { id: "3", name: "Appliances > Microwaves" },
  { id: "4", name: "Appliances > Refrigerators" },
];

export default function MultiSelectList() {
  const [selected, setSelected] = React.useState<string[]>([]);

  const toggleCategory = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const removeCategory = (id: string) => {
    setSelected((prev) => prev.filter((item) => item !== id));
  };

  return (
    <div className="w-[300px] space-y-4">
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

      {/* Seçilen kategorileri altta göster */}
      <div className="space-y-2">
        {selected.map((id) => {
          const cat = categories.find((c) => c.id === id);
          return (
            <div
              key={id}
              className="flex items-center justify-between border p-2 rounded bg-gray-50 text-sm"
            >
              <span>{cat?.name}</span>
              <button
                onClick={() => removeCategory(id)}
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
