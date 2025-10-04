import { getOrderById } from "@/actions/getOrderById";
import React from "react";

// types
interface OrderItem {
  id: string;
  title: string;
  sku?: string;
  qty: number;
  price: number;
  image?: string;
}

interface Address {
  name: string;
  phone?: string;
  line1: string;
  line2?: string;
  city: string;
  zip?: string;
  country?: string;
}

interface Order {
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
}

const formatPrice = (v: number) => v.toLocaleString("tr-TR", { style: "currency", currency: "TRY" });

export default async function OrderConfirmationPage({ orderId }: { orderId: string }) {
    const order = await getOrderById(orderId);
  

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Sipariş Bulunamadı</h1>
          <p className="text-gray-600 mt-2">Bu sipariş numarasına ait bir kayıt bulunamadı.</p>
          <a href="/orders" className="mt-4 inline-block text-sm text-primary-600 underline">
            Siparişlerime Dön
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Header / confirmation hero */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-10 flex flex-col md:flex-row items-start gap-6">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-semibold">Siparişiniz Alındı!</h1>
            <p className="mt-2 text-sm text-gray-600">
              Sipariş numaranız <span className="font-medium text-gray-800">{order.id}</span>. Teşekkürler — ödeme alınmış ve paket hazırlanıyor.
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
              {order.trackingUrl && (
                <a
                  href={order.trackingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-white border px-4 py-2 text-sm shadow-sm hover:shadow-md"
                >
                  Kargo Takip
                </a>
              )}
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

        {/* Order details */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-lg font-medium">Sipariş Detayları</h2>
              <ul className="mt-4 divide-y">
                {order.items.map((it) => (
                  <li key={it.id} className="py-4 flex gap-4 items-center">
                    <div className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
                      {it.image ? (
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
          </div>

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
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
