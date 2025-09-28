import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { CartClient } from './cart-client';
import { getCart } from '@/actions/cart';

export default async function CartPage() {
  const cart = await getCart();
  
  if (!cart) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500">Sepet yüklenemedi</p>
      </div>
    );
  }

  // Boş sepet
  if (!cart.items.length) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Sepetiniz Boş</h1>
          <p className="text-gray-600 mb-6">
            Alışverişe başlamak için ürünleri keşfedin
          </p>
          <Link
            href="/products"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Alışverişe Başla
          </Link>
        </div>
      </div>
    );
  }

  // Summary hesaplaması
  const FREE_SHIPPING_THRESHOLD = 500; // 500 TL ücretsiz kargo
  const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 50; // 50 TL kargo ücreti
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const summary = {
    subtotal,
    itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    shippingCost,
    total: subtotal + shippingCost,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    remainingForFreeShipping
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Sepetim</h1>
      <CartClient initialCart={{ items: cart.items, summary }} />
    </div>
  );
}