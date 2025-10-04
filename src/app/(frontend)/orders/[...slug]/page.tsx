import React from "react";

type OrderItem = {
  id: string;
  title: string;
  sku?: string;
  qty: number;
  price: number;
  image?: string;
};

type Address = {
  name: string;
  phone?: string;
  line1: string;
  line2?: string;
  city: string;
  zip?: string;
  country?: string;
};

type Order = {
  id: string;
  createdAt: string;
  status: string;
  total: number;
  subtotal: number;
  shippingCost: number;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: string;
  trackingUrl?: string | null;
};

const formatPrice = (v: number) =>
  v.toLocaleString("tr-TR", { style: "currency", currency: "TRY" });

export default function OrderConfirmationPage({
  order = SAMPLE_ORDER,
}: {
  order?: Order;
}) {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Header / confirmation hero */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-10 flex flex-col md:flex-row items-start gap-6">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-semibold">Siparişiniz Alındı!</h1>
            <p className="mt-2 text-sm text-gray-600">
              Sipariş numaranız <span className="font-medium text-gray-800">{order.id}</span>. Teşekkürler —
              ödeme alınmış ve paket hazırlanıyor.
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg border">
                <div className="text-xs text-gray-500">Tahmini Teslim</div>
                <div className="mt-1 font-medium">2 - 5 iş günü</div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border">
                <div className="text-xs text-gray-500">Toplam</div>
                <div className="mt-1 font-medium">{formatPrice(order.total)}</div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border">
                <div className="text-xs text-gray-500">Ödeme</div>
                <div className="mt-1 font-medium">{order.paymentMethod}</div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <a
                href={order.trackingUrl ?? '#'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-white border px-4 py-2 text-sm shadow-sm hover:shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7l6 6-6 6" />
                </svg>
                Kargo Takip
              </a>

              <a
                href={`/orders/${order.id}/invoice.pdf`}
                className="inline-flex items-center gap-2 rounded-lg bg-primary-600 text-white px-4 py-2 text-sm shadow-sm hover:opacity-95"
              >
                Fatura / İndir
              </a>

              <a href="/" className="ml-auto inline-flex items-center gap-2 text-sm text-gray-600">
                Mağazaya dön
              </a>
            </div>
          </div>
        </div>

        {/* Main layout: order items + summary + shipping */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: items and recommended */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-lg font-medium">Sipariş Detayları</h2>

              <ul className="mt-4 divide-y">
                {order.items.map((it) => (
                  <li key={it.id} className="py-4 flex gap-4 items-center">
                    <div className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
                      {it.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={it.image} alt={it.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-xs text-gray-400">Resim yok</div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="font-medium">{it.title}</div>
                          {it.sku && <div className="text-xs text-gray-500 mt-1">SKU: {it.sku}</div>}
                        </div>

                        <div className="text-right">
                          <div className="font-medium">{formatPrice(it.price)}</div>
                          <div className="text-sm text-gray-500">Adet: {it.qty}</div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-lg font-medium">Sık Sorulanlar & Destek</h3>
              <div className="mt-3 text-sm text-gray-600 space-y-2">
                <p>
                  Siparişiniz hakkında soru varsa <a href="/support" className="underline">yardım sayfamıza</a> göz atın veya
                  <a href="tel:+900000000000" className="ml-1 underline"> +90 0 000 000 00</a> numarasından bizi arayın.
                </p>
                <p>Ürün iade ve değişim süreçleri için <a href="/returns" className="underline">iade politikamızı</a> inceleyebilirsiniz.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-lg font-medium">Benzer Ürünler</h3>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {RECOMMENDED.map((p) => (
                  <a key={p.id} href={p.href} className="block p-2 bg-gray-50 rounded-lg hover:shadow">
                    <div className="w-full h-28 bg-gray-100 rounded overflow-hidden mb-2 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-sm font-medium">{p.title}</div>
                    <div className="text-xs text-gray-500">{formatPrice(p.price)}</div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right: summary + shipping address */}
          <aside className="space-y-6">
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-lg font-medium">Sipariş Özeti</h3>
              <div className="mt-4 space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Ara Toplam</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kargo</span>
                  <span>{formatPrice(order.shippingCost)}</span>
                </div>
                <div className="flex justify-between font-medium border-t pt-2">
                  <span>Toplam</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>

              <div className="mt-4">
                <a href={`/orders/${order.id}/invoice.pdf`} className="w-full block text-center rounded-lg bg-primary-600 text-white px-4 py-2">Faturayı İndir</a>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-lg font-medium">Teslimat Bilgileri</h3>
              <div className="mt-3 text-sm text-gray-700">
                <div className="font-medium">{order.shippingAddress.name}</div>
                <div>{order.shippingAddress.line1}</div>
                {order.shippingAddress.line2 && <div>{order.shippingAddress.line2}</div>}
                <div>
                  {order.shippingAddress.city} {order.shippingAddress.zip}
                </div>
                {order.shippingAddress.country && <div>{order.shippingAddress.country}</div>}
                {order.shippingAddress.phone && <div className="mt-2 text-xs text-gray-500">{order.shippingAddress.phone}</div>}
              </div>

              <div className="mt-4">
                <a href="/account/addresses" className="text-sm underline">Adresleri yönet</a>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-lg font-medium">Sipariş Durumu</h3>
              <div className="mt-3 text-sm text-gray-700">{order.status}</div>
              <div className="mt-3">
                <a href={order.trackingUrl ?? '#'} target="_blank" rel="noreferrer" className="text-sm underline">Kargo detaylarını gör</a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

// ---------------------- Sample data for local preview ----------------------
const SAMPLE_ORDER: Order = {
  id: "CMGC011A30001RQ0Z8BL5RYCU",
  createdAt: new Date().toISOString(),
  status: "Hazırlanıyor",
  total: 599.0,
  subtotal: 549.0,
  shippingCost: 50.0,
  paymentMethod: "Kredi Kartı (**** 4242)",
  trackingUrl: null,
  shippingAddress: {
    name: "Onur Taş",
    phone: "+90 555 555 55 55",
    line1: "Barbaros Mah. Example Sk. No:4",
    line2: "Daire 6",
    city: "İstanbul",
    zip: "34746",
    country: "Türkiye",
  },
  items: [
    {
      id: "p_1",
      title: "Oyuncak Araba - Kırmızı",
      sku: "TOY-AR-RED",
      qty: 1,
      price: 299,
      image: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800&q=60",
    },
    {
      id: "p_2",
      title: "Lego Seti - Uzay Serisi",
      sku: "LG-SPACE-01",
      qty: 1,
      price: 250,
      image: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=60",
    },
  ],
};

const RECOMMENDED = [
  { id: "r1", title: "Pelüş Ayı", price: 129, href: "/p/pelus-ayi", image: "https://images.unsplash.com/photo-1543785734-4b8f9b3b3f6b?w=800&q=60" },
  { id: "r2", title: "Ahşap Bloklar", price: 89, href: "/p/ahsap-blok", image: "https://images.unsplash.com/photo-1599058917212-8c0cc2d1f4c7?w=800&q=60" },
  { id: "r3", title: "Eğitici Puzzle", price: 59, href: "/p/puzzle", image: "https://images.unsplash.com/photo-1523475496153-3d6ccf2e3c1f?w=800&q=60" },
  { id: "r4", title: "Oyuncak Dolu Hediye Kutusu", price: 199, href: "/p/hediye-kutu", image: "https://images.unsplash.com/photo-1582719478172-8f3b2f2f2f2f?w=800&q=60" },
];
