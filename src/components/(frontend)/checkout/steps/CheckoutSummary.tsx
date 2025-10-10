"use client";

import { CheckoutSummaryProps } from "../types";

export default function CheckoutSummary({ 
  subtotal, 
  shipping, 
  discount = 0,  // Default değer
  formData 
}: CheckoutSummaryProps) {
  
  const getDeliveryMethodText = () => {
    switch (formData.delivery.method) {
      case "standard":
        return "Standart Kargo (3-5 iş günü)";
      case "express":
        return "Hızlı Kargo (1-2 iş günü)";
      case "same-day":
        return "Aynı Gün Teslimat";
      default:
        return "Kargo seçilmedi";
    }
  };

  const getPaymentMethodText = () => {
    switch (formData.payment.method) {
      case "card":
        return "Kredi/Banka Kartı";
      case "transfer":
        return "Havale/EFT";
      case "cash":
        return "Kapıda Ödeme";
      default:
        return "Ödeme yöntemi seçilmedi";
    }
  };

  // Kargo maliyetini al
  const actualShipping = shipping || 0;
  const finalTotal = subtotal + actualShipping - discount;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Sipariş Özeti</h2>
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Sağ Taraf - Fiyat Özeti */}
        <div className="p-4 bg-gray-50 rounded-lg h-fit">
          <h3 className="font-medium mb-4">Fiyat Detayları</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Ara Toplam</span>
              <span className="font-medium">₺{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Kargo</span>
              <span className="font-medium">
                {actualShipping === 0 ? (
                  <span className="text-green-600">Ücretsiz</span>
                ) : (
                  `₺${actualShipping.toFixed(2)}`
                )}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>İndirim</span>
                <span>-₺{discount.toFixed(2)}</span>
              </div>
            )}
            <hr className="my-2 border-gray-300" />
            <div className="flex justify-between font-bold text-lg pt-2">
              <span>Toplam</span>
              <span className="text-blue-600">₺{finalTotal.toFixed(2)}</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              Siparişiniz onaylandıktan sonra kargo takip bilgisi e-posta adresinize gönderilecektir.
            </p>
          </div>
        </div>
      </div>
    </div>
  )};