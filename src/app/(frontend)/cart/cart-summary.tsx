'use client';

import { useRouter } from 'next/navigation';

type CartSummaryProps = {
  summary: {
    subtotal: number;
    shippingCost: number;
    total: number;
    itemCount: number;
    freeShippingThreshold: number;
    remainingForFreeShipping: number;
  };
};

export function CartSummary({ summary }: CartSummaryProps) {
  const router = useRouter();

  const handleCheckout = () => {
    router.push('/checkout');
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg sticky top-4">
      <h2 className="text-xl font-bold mb-4">Sepet Özeti</h2>
      
      {/* Ücretsiz kargo progress */}
      {summary.remainingForFreeShipping > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Ücretsiz kargoya{' '}
            <span className="font-bold text-blue-600">
              ₺{summary.remainingForFreeShipping.toFixed(2)}
            </span>{' '}
            kaldı!
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-orange-600 h-2 rounded-full transition-all"
              style={{
                width: `${Math.min(
                  (summary.subtotal / summary.freeShippingThreshold) * 100,
                  100
                )}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Fiyatlar */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Ara Toplam</span>
          <span className="font-medium">₺{summary.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Kargo</span>
          <span className="font-medium">
            {summary.shippingCost === 0 ? (
              <span className="text-green-600">Ücretsiz</span>
            ) : (
              `₺${summary.shippingCost.toFixed(2)}`
            )}
          </span>
        </div>
        <div className="border-t pt-3 flex justify-between items-center">
          <span className="text-lg font-bold">Toplam</span>
          <span className="text-2xl font-bold text-orange-600">
            ₺{summary.total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Checkout */}
      <button
        onClick={handleCheckout}
        disabled={summary.itemCount === 0}
        className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Siparişi Tamamla
      </button>
      
      <p className="text-xs text-gray-500 mt-3 text-center">
        {summary.itemCount} ürün sepetinizde
      </p>
    </div>
  );
}

//   const handleCheckout = () => {
//     startTransition(async () => {
//       const result = await checkoutAction();

//       if (result.success) {
//         toast.success('Siparişiniz alındı!');
//         // router.push(`/orders/${result.data.order.id}`);
//         router.push("/checkout}");
//       } else {
//         toast.error(result.error || 'Sipariş oluşturulamadı');
//       }
//     });
//   };

  