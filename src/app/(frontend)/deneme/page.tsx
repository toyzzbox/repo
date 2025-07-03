"use client";

import * as React from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const categories = [
  { id: "1", name: "Appliances > Irons" },
  { id: "2", name: "Appliances > Kettles" },
  { id: "3", name: "Appliances > Microwaves" },
  { id: "4", name: "Appliances > Refrigerators" },
];

export default function MultiSelectCategories() {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string[]>([]);

  const toggleCategory = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            {selected.length > 0
              ? `${selected.length} kategori seçildi`
              : "Kategori seçin"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
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
                    className={`mr-2 h-4 w-4 ${
                      selected.includes(category.id) ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {category.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Seçilen kategorileri altta göster */}
      <div className="space-y-2">
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
