import { Button } from "@/components/ui/button";

export default function CheckoutSummary() {
  return (
    <div className="border rounded-lg p-6 shadow-sm space-y-4 bg-white">
      <h2 className="text-lg font-semibold">Sipariş Özeti</h2>
      {/* Örnek veriler */}
      <div className="flex justify-between text-sm">
        <span>Ara Toplam</span>
        <span>1.200,00 TL</span>
      </div>
      <div className="flex justify-between text-sm">
        <span>Kargo</span>
        <span>Ücretsiz</span>
      </div>
      <hr />
      <div className="flex justify-between font-semibold">
        <span>Toplam</span>
        <span>1.200,00 TL</span>
      </div>
      <Button className="w-full mt-4">Siparişi Tamamla</Button>
    </div>
  );
}
