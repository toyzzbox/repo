"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

import AddressSection from "./steps/AddressSection";
import DeliverySection from "./steps/DeliverySection";
import PaymentSection from "./steps/PaymentSection";
import CheckoutSummary from "./steps/CheckoutSummary";
import ProgressBar from "./ProgressBar";

import { FormData, Step, steps } from "./types";

export default function CheckoutForm() {
  const [stepIndex, setStepIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<FormData>({
    address: {
      name: '',
      phone: '',
      address: '',
      city: ''
    },
    delivery: {
      method: '',
      date: ''
    },
    payment: {
      method: '',
      cardNumber: '',
      expiryDate: '',
      cvv: ''
    }
  });

  const step = steps[stepIndex];

  const validateStep = (currentStep: Step): boolean => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 'address':
        if (!formData.address.name) newErrors.name = 'Ad soyad gerekli';
        if (!formData.address.phone) newErrors.phone = 'Telefon gerekli';
        if (!formData.address.address) newErrors.address = 'Adres gerekli';
        if (!formData.address.city) newErrors.city = 'Şehir seçimi gerekli';
        break;

      case 'delivery':
        if (!formData.delivery.method) {
          alert('Lütfen bir kargo seçeneği seçiniz');
          return false;
        }
        break;

      case 'payment':
        if (!formData.payment.method) {
          alert('Lütfen bir ödeme yöntemi seçiniz');
          return false;
        }
        if (formData.payment.method === 'card') {
          if (!formData.payment.cardNumber) newErrors.cardNumber = 'Kart numarası gerekli';
          if (!formData.payment.expiryDate) newErrors.expiryDate = 'Son kullanma tarihi gerekli';
          if (!formData.payment.cvv) newErrors.cvv = 'CVV gerekli';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const next = () => {
    if (validateStep(step)) {
      if (stepIndex < steps.length - 1) {
        setStepIndex((i) => i + 1);
        setErrors({});
      }
    }
  };

  const back = () => {
    if (stepIndex > 0) {
      setStepIndex((i) => i - 1);
      setErrors({});
    }
  };

  const handleComplete = () => {
    alert("Sipariş başarıyla tamamlandı! 🎉");
    // Gerçek uygulamada burada form verisi sunucuya gönderilir
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <ProgressBar step={step} />

      <div className="bg-white rounded-lg shadow-sm border p-6">
        {step === "address" && (
          <AddressSection
            data={formData.address}
            onChange={(data) => setFormData((prev) => ({ ...prev, address: data }))}
            errors={errors}
          />
        )}
        {step === "delivery" && (
          <DeliverySection
            data={formData.delivery}
            onChange={(data) => setFormData((prev) => ({ ...prev, delivery: data }))}
          />
        )}
        {step === "payment" && (
          <PaymentSection
            data={formData.payment}
            onChange={(data) => setFormData((prev) => ({ ...prev, payment: data }))}
            errors={errors}
          />
        )}
        {step === "summary" && (
          <CheckoutSummary
            subtotal={749.9}
            shipping={formData.delivery.method === "express" ? 39.9 : 19.9}
            discount={20}
            formData={formData}
          />
        )}
      </div>

      <div className="flex justify-between">
        {stepIndex > 0 && (
          <Button variant="outline" onClick={back} className="px-6">
            ← Geri
          </Button>
        )}

        <div className="ml-auto">
          {stepIndex < steps.length - 1 ? (
            <Button onClick={next} className="px-6">
              Devam Et →
            </Button>
          ) : (
            <Button onClick={handleComplete} className="px-6 bg-green-600 hover:bg-green-700">
              Siparişi Onayla ✓
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
