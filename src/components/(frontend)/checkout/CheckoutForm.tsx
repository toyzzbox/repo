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
    shippingCost: number;
    total: number;
    itemCount: number;
  };
};

export default function CheckoutForm({ cartData }: CheckoutFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
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

  // Eğer sepet boşsa cart sayfasına yönlendir
  useEffect(() => {
    if (!cartData || cartData.itemCount === 0) {
      toast.error('Sepetiniz boş');
      router.push('/cart');
    }
  }, [cartData, router]);

  const step = steps[stepIndex];

  const validateStep = (currentStep: Step): boolean => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 'address':
        if (!formData.address.name.trim()) newErrors.name = 'Ad soyad gerekli';
        if (!formData.address.phone.trim()) newErrors.phone = 'Telefon gerekli';
        if (!formData.address.address.trim()) newErrors.address = 'Adres gerekli';
        if (!formData.address.city.trim()) newErrors.city = 'Şehir seçimi gerekli';
        
        // Telefon format kontrolü
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
        if (formData.payment.method === 'card') {
          if (!formData.payment.cardNumber) newErrors.cardNumber = 'Kart numarası gerekli';
          if (!formData.payment.expiryDate) newErrors.expiryDate = 'Son kullanma tarihi gerekli';
          if (!formData.payment.cvv) newErrors.cvv = 'CVV gerekli';
          
          // Kart numarası kontrolü
          if (formData.payment.cardNumber && !/^[0-9]{16}$/.test(formData.payment.cardNumber.replace(/\s/g, ''))) {
            newErrors.cardNumber = 'Geçerli bir kart numarası giriniz (16 haneli)';
          }
          
          // CVV kontrolü
          if (formData.payment.cvv && !/^[0-9]{3,4}$/.test(formData.payment.cvv)) {
            newErrors.cvv = 'Geçerli bir CVV giriniz (3-4 haneli)';
          }
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
    startTransition(async () => {
      const result = await createOrderAction({
        address: formData.address,
        delivery: formData.delivery,
        payment: {
          method: formData.payment.method,
        },
      });

      if (result.success) {
        toast.success('Siparişiniz başarıyla oluşturuldu! 🎉');
        router.push(`/orders/${result.data.orderId}`);
      } else {
        toast.error(result.error || 'Sipariş oluşturulamadı');
      }
    });
  };

  // Sepet verisi yoksa loading göster
  if (!cartData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">Yükleniyor...</div>
      </div>
    );
  }

  // Kargo maliyetini hesapla
  const shippingCost = formData.delivery.method === "express" ? 39.9 : 
                       formData.delivery.method === "standard" ? 19.9 : 0;

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
            subtotal={cartData.subtotal}
            shipping={shippingCost}
            discount={0}
            formData={formData}
          />
        )}
      </div>

      <div className="flex justify-between">
        {stepIndex > 0 && (
          <Button 
            variant="outline" 
            onClick={back} 
            className="px-6"
            disabled={isPending}
          >
            ← Geri
          </Button>
        )}

        <div className="ml-auto">
          {stepIndex < steps.length - 1 ? (
            <Button 
              onClick={next} 
              className="px-6"
              disabled={isPending}
            >
              Devam Et →
            </Button>
          ) : (
            <Button 
              onClick={handleComplete} 
              className="px-6 bg-green-600 hover:bg-green-700"
              disabled={isPending}
            >
              {isPending ? 'İşleniyor...' : 'Siparişi Onayla ✓'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}