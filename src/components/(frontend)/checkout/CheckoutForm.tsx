"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import DeliverySection from "./steps/DeliverySection";
import PaymentSection from "./steps/PaymentSection";
import CheckoutSummary from "./steps/CheckoutSummary";

import { FormData } from "./types";
import { createOrderAction } from "@/actions/order.actions";
import AddressSelector from "./steps/AddressSection";
import AddressSection from "../account/adress/AddressSection";

type CheckoutFormProps = {
  cartData?: {
    subtotal: number;
    itemCount: number;
  };
};

export default function CheckoutForm({ cartData }: CheckoutFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Adres validasyonu
    if (!formData.address.name.trim()) newErrors.name = 'Ad soyad gerekli';
    if (!formData.address.phone.trim()) newErrors.phone = 'Telefon gerekli';
    if (!formData.address.address.trim()) newErrors.address = 'Adres gerekli';
    if (!formData.address.city.trim()) newErrors.city = 'Şehir gerekli';
    if (formData.address.phone && !/^[0-9]{10,11}$/.test(formData.address.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Geçerli bir telefon numarası giriniz';
    }

    // Kargo validasyonu
    if (!formData.delivery.method) {
      newErrors.delivery = 'Lütfen bir kargo seçeneği seçiniz';
    }

    // Ödeme validasyonu
    if (!formData.payment.method) {
      newErrors.payment = 'Lütfen bir ödeme yöntemi seçiniz';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleComplete = () => {
    if (!validateForm()) {
      toast.error('Lütfen tüm zorunlu alanları doldurun');
      return;
    }

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
  if (!cartData) return <div className="max-w-6xl mx-auto p-6 text-center">Yükleniyor...</div>;

  const shippingCost = formData.delivery.method === 'express' ? 39.9 : formData.delivery.method === 'standard' ? 19.9 : 0;
  const total = (cartData.subtotal || 0) + shippingCost;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sol taraf - Form */}
        <div className="lg:col-span-2 space-y-6">

             <AddressSection/>
           </div>

          {/* Kargo Seçimi */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <DeliverySection
              data={formData.delivery}
              onChange={data => setFormData(prev => ({ ...prev, delivery: data }))}
            />
            {errors.delivery && (
              <p className="text-red-500 text-sm mt-2">{errors.delivery}</p>
            )}
          </div>

          {/* Ödeme Yöntemi */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <PaymentSection
              data={formData.payment}
              onChange={data => setFormData(prev => ({ ...prev, payment: data }))}
              errors={errors}
            />
            {errors.payment && (
              <p className="text-red-500 text-sm mt-2">{errors.payment}</p>
            )}
          </div>
        </div>

        {/* Sağ taraf - Özet */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Sipariş Özeti</h2>
            <CheckoutSummary
              subtotal={cartData.subtotal}
              shipping={shippingCost}
              total={total}
              formData={formData}
            />
            
            <Button 
              onClick={handleComplete} 
              disabled={isPending}
              className="w-full mt-6 bg-green-600 hover:bg-green-700"
            >
              {isPending ? 'İşleniyor...' : 'Siparişi Onayla ✓'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}