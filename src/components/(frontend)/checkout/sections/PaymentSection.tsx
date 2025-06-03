"use client";

import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { CreditCard, Banknote, Wallet } from "lucide-react";

const paymentMethods = [
  {
    id: "credit_card",
    name: "Kredi / Banka Kartı",
    icon: <CreditCard className="w-5 h-5" />,
  },
  {
    id: "cash_on_delivery",
    name: "Kapıda Ödeme",
    icon: <Banknote className="w-5 h-5" />,
  },
  {
    id: "wallet",
    name: "Cüzdan (Bakiye)",
    icon: <Wallet className="w-5 h-5" />,
  },
];

export default function PaymentSection() {
  const [selected, setSelected] = useState("credit_card");

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Ödeme Yöntemi</h2>

      <RadioGroup value={selected} onValueChange={setSelected}>
        {paymentMethods.map((method) => (
          <Card
            key={method.id}
            className={`p-4 flex items-center justify-between cursor-pointer border ${
              selected === method.id ? "border-black" : "border-gray-200"
            }`}
            onClick={() => setSelected(method.id)}
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value={method.id} id={method.id} />
              <Label htmlFor={method.id} className="cursor-pointer flex items-center gap-2">
                {method.icon}
                {method.name}
              </Label>
            </div>
          </Card>
        ))}
      </RadioGroup>
    </section>
  );
}
