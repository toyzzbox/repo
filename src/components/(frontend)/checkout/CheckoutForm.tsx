"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import AddressSection from "./steps/AddressSection";
import DeliverySection from "./steps/DeliverySection";
import PaymentSection from "./steps/PaymentSection";
import CheckoutSummary from "./steps/CheckoutSummary";
import ProgressBar from "./ProgressBar";

import { FormData, Step, steps } from "./types";
import { createOrderAction } from "@/actions/order.actions";

type CheckoutFormProps = {
  cartData?: {
    subtotal: number;
    itemCount: number;
  };
};

export default function CheckoutForm({ cartData }: CheckoutFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [stepIndex, setStepIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<FormData>({
    address: { name: '', phone: '', address: '', city: '', district: '', postalCode: '' },
    delivery: { method: '', date: '' },
    payment: { method: '', cardNumber: '', expiryDate: '', cvv: '' },
  });

  // Sepet boşsa yönlendir
  useEffect(() => {
    if (!cartData || cartData.itemCount === 0) {
      toast.error('Sepetiniz boş');
      router.push('/cart');
    }
  }, [cartData, router]);

  const step = steps[stepIndex];

  const validateStep = (currentStep: Step) => {
    const newErrors: Record<string, string> = {};
    switch (currentStep) {
      case 'address':
        if (!formData.address.name.trim()) newErrors.name = 'Ad soyad gerekli';
        if (!formData.address.phone.trim()) newErrors.phone = 'Telefon gerekli';
        if (!formData.address.address.trim()) newErrors.address = 'Adres gerekli';
        if (!formData.address.city.trim()) newErrors.city = 'Şehir gerekli';
        if (formData.address.phone && !/^[0-9]{10,11}$/.test(formData.address.phone.replace(/\s/g, ''))) {
          newErrors.phone = 'Geçerli bir telefon numarası giriniz';
        }
        break;

      case 'delivery':
        if (!formData.delivery.method) {
          toast.error('Lütfen bir kargo seçeneği seçiniz');
          return false;
        }
        break;

      case 'payment':
        if (!formData.payment.method) {
          toast.error('Lütfen bir ödeme yöntemi seçiniz');
          return false;
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const next = () => {
    if (validateStep(step)) {
      if (stepIndex < steps.length - 1) {
        setStepIndex(i => i + 1);
        setErrors({});
      }
    }
  };

  const back = () => {
    if (stepIndex > 0) {
      setStepIndex(i => i - 1);
      setErrors({});
    }
  };

  const handleComplete = () => {
    startTransition(async () => {
      const result = await createOrderAction({
        address: formData.address,
        delivery: formData.delivery,
        payment: { method: formData.payment.method },
      });

      if (result.success) {
        toast.success('Siparişiniz başarıyla oluşturuldu! 🎉');
        router.push(`/orders/${result.data.orderId}`);
      } else {
        toast.error(result.error || 'Sipariş oluşturulamadı');
      }
    });
  };

  // Sepet yoksa loading
  if (!cartData) return <div className="max-w-4xl mx-auto p-6 text-center">Yükleniyor...</div>;

  const shippingCost = formData.delivery.method === 'express' ? 39.9 : formData.delivery.method === 'standard' ? 19.9 : 0;
  const total = (cartData.subtotal || 0) + shippingCost;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <ProgressBar step={step} />

      <div className="bg-white rounded-lg shadow-sm border p-6">
        {step === 'address' && (
          <AddressSection
            data={formData.address}
            onChange={data => setFormData(prev => ({ ...prev, address: data }))}
            errors={errors}
          />
        )}
        {step === 'delivery' && (
          <DeliverySection
            data={formData.delivery}
            onChange={data => setFormData(prev => ({ ...prev, delivery: data }))}
          />
        )}
        {step === 'payment' && (
          <PaymentSection
            data={formData.payment}
            onChange={data => setFormData(prev => ({ ...prev, payment: data }))}
            errors={errors}
          />
        )}
        {step === 'summary' && (
          <CheckoutSummary
            subtotal={cartData.subtotal}
            shipping={shippingCost}
            total={total}
            formData={formData}
          />
        )}
      </div>

      <div className="flex justify-between">
        {stepIndex > 0 && (
          <Button variant="outline" onClick={back} disabled={isPending}>
            ← Geri
          </Button>
        )}
        <div className="ml-auto">
          {stepIndex < steps.length - 1 ? (
            <Button onClick={next} disabled={isPending}>
              Devam Et →
            </Button>
          ) : (
            <Button onClick={handleComplete} disabled={isPending} className="bg-green-600 hover:bg-green-700">
              {isPending ? 'İşleniyor...' : 'Siparişi Onayla ✓'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
