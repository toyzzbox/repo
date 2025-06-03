"use client";

import { Button } from "@/components/ui/button";

type Props = {
  subtotal: number;
  shipping: number;
  discount?: number;
};

export default function CheckoutSummary({ subtotal, shipping, discount = 0 }: Props) {
  const total = subtotal + shipping - discount;

  const handleCheckout = () => {
    // 💡 Buraya server action entegre edilecek
    alert("Sipariş tamamlandı (demo)!");
  };

  return (
    <section className="border rounded-md p-6 space-y-4 shadow-sm">
      <h2 className="text-lg font-semibold">Sipariş Özeti</h2>

      <div className="flex justify-between text-sm">
        <span>Ara Toplam</span>
        <span>{subtotal.toFixed(2)} TL</span>
      </div>

      <div className="flex justify-between text-sm">
        <span>Kargo</span>
        <span>{shipping.toFixed(2)} TL</span>
      </div>

      {discount > 0 && (
        <div className="flex justify-between text-sm text-green-600">
          <span>İndirim</span>
          <span>-{discount.toFixed(2)} TL</span>
        </div>
      )}

      <hr />

      <div className="flex justify-between font-bold text-base">
        <span>Toplam</span>
        <span>{total.toFixed(2)} TL</span>
      </div>

      <Button className="w-full" onClick={handleCheckout}>
        Siparişi Tamamla
      </Button>
    </section>
  );
}
