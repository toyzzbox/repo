'use client';

import { useTransition } from 'react';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { addToCartAction } from '@/actions/cart.actions';

type AddToCartButtonProps = {
  productId: string;
  quantity?: number;
  disabled?: boolean;
};

export function AddToCartButton({
  productId,
  quantity = 1,
  disabled = false,
}: AddToCartButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleAddToCart = () => {
    startTransition(async () => {
      const result = await addToCartAction(productId, quantity);

      if (result.success) {
        toast.success('Ürün sepete eklendi');
        router.refresh(); // Sepet badge'i güncelle
      } else {
        toast.error(result.error || 'Bir hata oluştu');
      }
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={disabled || isPending}
      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      <ShoppingCart className="w-5 h-5" />
      {isPending ? 'Ekleniyor...' : 'Sepete Ekle'}
    </button>
  );
}
