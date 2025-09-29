import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/actions/auth';
import CheckoutForm from "@/components/(frontend)/checkout/CheckoutForm";
import { getCart } from '@/actions/cart';

export default async function CheckoutPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login?redirect=/checkout');
  }

  const cart = await getCart();

  if (!cart.items || cart.items.length === 0) {
    redirect('/cart');
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Siparişi Tamamla</h1>
      <CheckoutForm 
        cartData={{
          subtotal: cart.summary.subtotal,
          shippingCost: cart.summary.shippingCost,
          total: cart.summary.total,
          itemCount: cart.summary.itemCount,
        }}
      />
    </main>
  );
}