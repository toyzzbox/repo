"use client";

import { CheckoutSummaryProps } from "../types";

export default function CheckoutSummary({ subtotal, shipping, discount, formData }: CheckoutSummaryProps) {
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
      case "installment":
        return "Taksitli Ödeme";
      default:
        return "Ödeme yöntemi seçilmedi";
    }
  };

  const getShippingCost = () => {
    switch (formData.delivery.method) {
      case "standard":
        return 19.9;
      case "express":
        return 39.9;
      case "same-day":
        return 59.9;
      default:
        return shipping;
    }
  };

  const actualShipping = getShippingCost();
  const finalTotal = subtotal + actualShipping - discount;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Sipariş Özeti</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sol Taraf - Bilgiler */}
        <div className="space-y-4">
          {/* Teslimat Adresi */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-3 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
              Teslimat Adresi
            </h3>
            <div className="text-sm space-y-1">
              <p className="font-medium">{formData.address.name}</p>
              <p className="text-gray-600">{formData.address.phone}</p>
              <p className="text-gray-700">{formData.address.address}</p>
              <p className="text-gray-700 capitalize">{formData.address.city}</p>
            </div>
          </div>

          {/* Kargo Bilgileri */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-3 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              Kargo Bilgileri
            </h3>
            <div className="text-sm space-y-1">
              <p className="font-medium">{getDeliveryMethodText()}</p>
              {formData.delivery.date && (
                <p className="text-gray-600">
                  Tercih edilen tarih: {formData.delivery.date}
                </p>
              )}
              <p className="text-gray-600">
                Kargo ücreti: ₺{actualShipping.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Ödeme Bilgileri */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-3 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2" />
              Ödeme Bilgileri
            </h3>
            <div className="text-sm space-y-1">
              <p className="font-medium">{getPaymentMethodText()}</p>
              {formData.payment.method === "card" && (
                <>
                  <p className="text-gray-600">
                    Kart Numarası: **** **** **** {formData.payment.cardNumber.slice(-4)}
                  </p>
                  <p className="text-gray-600">
                    Son Kullanma: {formData.payment.expiryDate}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Sağ Taraf - Fiyat Özeti */}
        <div className="p-4 bg-gray-50 rounded-lg h-fit">
          <h3 className="font-medium mb-4">Fiyat Detayları</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Ürün Toplamı:</span>
              <span>₺{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Kargo:</span>
              <span>₺{actualShipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>İndirim:</span>
              <span>-₺{discount.toFixed(2)}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-bold text-lg">
              <span>Toplam:</span>
              <span>₺{finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
