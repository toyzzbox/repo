"use client";

import { useState } from "react";
import AddressSection from "./sections/AddressSection";
import DeliverySection from "./sections/DeliverySection";
import PaymentSection from "./sections/PaymentSection";
import CheckoutSummary from "./sections/CheckoutSummary";
import { Button } from "@/components/ui/button";

function ProgressBar({ step }: { step: string }) {
  const steps = ["Adres", "Kargo", "Ödeme", "Özet"];
  const currentIndex = steps.findIndex(
    (_, i) => ["address", "delivery", "payment", "summary"][i] === step
  );

  return (
    <div className="flex justify-between mb-6">
      {steps.map((label, index) => (
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
  const [step, setStep] = useState<"address" | "delivery" | "payment" | "summary">("address");

  const next = () => {
    setStep((prev) =>
      prev === "address"
        ? "delivery"
        : prev === "delivery"
        ? "payment"
        : "summary"
    );
  };

  const back = () => {
    setStep((prev) =>
      prev === "summary"
        ? "payment"
        : prev === "payment"
        ? "delivery"
        : "address"
    );
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
        {step !== "address" && (
          <Button variant="ghost" onClick={back}>
            Geri
          </Button>
        )}
        {step !== "summary" ? (
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
