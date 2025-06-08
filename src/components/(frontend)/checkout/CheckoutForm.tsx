"use client";

import { useState } from "react";
import AddressSection from "./sections/AddressSection";
import DeliverySection from "./sections/DeliverySection";
import PaymentSection from "./sections/PaymentSection";
import CheckoutSummary from "./sections/CheckoutSummary";
import { Button } from "@/components/ui/button";

const steps = ["address", "delivery", "payment", "summary"] as const;

type Step = typeof steps[number];

function ProgressBar({ step }: { step: Step }) {
  const stepLabels = ["Adres", "Kargo", "Ödeme", "Özet"];
  const currentIndex = steps.indexOf(step);

  return (
    <div className="flex justify-between mb-6">
      {stepLabels.map((label, index) => (
        <div
          key={label}
          className={`flex-1 text-center text-sm ${
            index <= currentIndex ? "font-bold text-black" : "text-gray-400"
          }`}
        >
          {label}
        </div>
      ))}
    </div>
  );
}

export default function CheckoutForm() {
  const [stepIndex, setStepIndex] = useState(0);
  const step = steps[stepIndex];

  const next = () => {
    if (stepIndex < steps.length - 1) setStepIndex((i) => i + 1);
  };

  const back = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <ProgressBar step={step} />

      {step === "address" && <AddressSection />}
      {step === "delivery" && <DeliverySection />}
      {step === "payment" && <PaymentSection />}
      {step === "summary" && (
        <CheckoutSummary subtotal={749.9} shipping={19.9} discount={20} />
      )}

      <div className="flex justify-between">
        {stepIndex > 0 && (
          <Button variant="ghost" onClick={back}>
            Geri
          </Button>
        )}
        {stepIndex < steps.length - 1 ? (
          <Button onClick={next}>Devam Et</Button>
        ) : (
          <Button onClick={() => alert("Sipariş tamamlandı!")}>
            Siparişi Onayla
          </Button>
        )}
      </div>
    </div>
  );
}
