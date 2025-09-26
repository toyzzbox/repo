import { getCartCountAction } from '@/actions/cart.actions';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export async function CartBadge() {
  const count = await getCartCountAction();

  return (
    <Link href="/cart" className="relative">
      <ShoppingCart className="w-6 h-6" />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}