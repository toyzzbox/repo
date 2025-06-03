// components/(frontend)/checkout/sections/DeliverySection.tsx
"use client"; // bu bölüm interaktif olacak çünkü seçim yapılacak

import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

const shippingMethods = [
  {
    id: "standard",
    name: "Standart Kargo",
    description: "3-5 iş günü içinde teslimat",
    price: 0,
  },
  {
    id: "express",
    name: "Ekspres Kargo",
    description: "1-2 iş günü içinde teslimat",
    price: 49.99,
  },
];

export default function DeliverySection() {
  const [selected, setSelected] = useState("standard");

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Teslimat Yöntemi</h2>

      <RadioGroup value={selected} onValueChange={setSelected}>
        {shippingMethods.map((method) => (
          <Card
            key={method.id}
            className={`p-4 cursor-pointer border ${
              selected === method.id ? "border-black" : "border-gray-200"
            }`}
            onClick={() => setSelected(method.id)}
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value={method.id} id={method.id} />
              <Label htmlFor={method.id} className="cursor-pointer">
                <div className="font-medium">{method.name}</div>
                <div className="text-sm text-gray-600">{method.description}</div>
                <div className="text-sm font-semibold mt-1">
                  {method.price === 0 ? "Ücretsiz" : `${method.price.toFixed(2)} TL`}
                </div>
              </Label>
            </div>
          </Card>
        ))}
      </RadioGroup>
    </section>
  );
}
