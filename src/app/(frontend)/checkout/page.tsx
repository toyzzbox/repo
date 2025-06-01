// app/checkout/page.tsx
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function CheckoutPage() {
  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto p-4">
      
      {/* Teslimat ve Ödeme Bilgileri */}
      <Card>
        <CardContent className="space-y-6 pt-6">
          <div>
            <Label htmlFor="name">Ad Soyad</Label>
            <Input id="name" placeholder="Adınız Soyadınız" />
          </div>

          <div>
            <Label htmlFor="address">Adres</Label>
            <Input id="address" placeholder="Açık adres" />
          </div>

          <div>
            <Label htmlFor="card">Kart Bilgisi</Label>
            <Input id="card" placeholder="XXXX XXXX XXXX XXXX" />
          </div>

          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
            Siparişi Onayla
          </Button>
        </CardContent>
      </Card>

      {/* Sipariş Özeti */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h2 className="text-xl font-semibold">Sipariş Özeti</h2>
          {/* Dinamik sepetteki ürünler buraya */}
          <div className="flex justify-between">
            <span>Oyuncak Araba x1</span>
            <span>120₺</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Toplam</span>
            <span>120₺</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
