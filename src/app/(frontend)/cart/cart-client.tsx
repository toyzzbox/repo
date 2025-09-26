'use client';

import { useCart } from '@/hooks/use-cart';

import { CartItem } from './cart-item';
import { CartSummary } from './cart-summary';

type CartClientProps = {
  initialCart: {
    items: any[];
    summary: any;
  };
};

export function CartClient({ initialCart }: CartClientProps) {
  const cart = useCart(initialCart);

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Ürünler */}
      <div className="lg:col-span-2 space-y-4">
        {cart.items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onUpdateQuantity={cart.updateQuantity}
            onRemove={cart.removeItem}
            isPending={cart.isPending}
          />
        ))}
      </div>

      {/* Özet */}
      <div className="lg:col-span-1">
        <CartSummary summary={cart.summary} />
      </div>
    </div>
  );
}
