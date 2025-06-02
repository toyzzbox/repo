"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

export default function MobileFilterButton() {
  const [open, setOpen] = useState(false);

  // Bu örnek sadece butonu gösterir, dialog/modal entegresi opsiyoneldir
  return (
    <div className="fixed bottom-4 right-4 md:hidden z-50">
      <Button
        onClick={() => setOpen((prev) => !prev)}
        variant="default"
        className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white hover:bg-orange-700"
      >
        <SlidersHorizontal className="w-5 h-5" />
        Filtrele
      </Button>

      {/* Filtre Modalı buraya gelebilir */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg w-11/12 max-w-md shadow-lg">
            <h2 className="text-lg font-bold mb-4">Filtreler</h2>
            <p className="text-sm text-gray-600">(Buraya filtre alanları eklenecek)</p>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setOpen(false)} variant="outline">
                Kapat
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
