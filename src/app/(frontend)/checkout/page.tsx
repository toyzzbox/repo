import { Suspense } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/actions/auth';
import { prisma } from '@/lib/prisma';
import CheckoutForm from '@/components/checkout/CheckoutForm';

async function getCartData(userId: string) {
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });

  if (cartItems.length === 0) {
    return null;
  }

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.product.price * item.quantity);
  }, 0);

  const FREE_SHIPPING_THRESHOLD = 500;
  const STANDARD_SHIPPING = 19.9;
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;

  return {
    subtotal,
    shippingCost,
    total: subtotal + shippingCost,
    itemCount: cartItems.length,
  };
}

export default async function CheckoutPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login?redirect=/checkout');
  }

  const cartData = await getCartData(user.id);

  if (!cartData) {
    redirect('/cart');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Ödeme</h1>
        <Suspense fallback={<div className="text-center">Yükleniyor...</div>}>
          <CheckoutForm cartData={cartData} />
        </Suspense>
      </div>
    </div>
  );
}