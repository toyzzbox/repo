// hooks/use-cart.ts
'use client';

import { useOptimistic, useTransition } from 'react';
import {
  addToCartAction,
  updateCartItemAction,
  removeCartItemAction,
  clearCartAction,
} from '.././actions/cart.actions';

type CartItem = {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    slug: string;
    stock: number | null;
    medias: Array<{
      media: {
        urls: string[];
      };
    }>;
  };
};

type CartSummary = {
  subtotal: number;
  shippingCost: number;
  total: number;
  itemCount: number;
  freeShippingThreshold: number;
  remainingForFreeShipping: number;
};

type CartState = {
  items: CartItem[];
  summary: CartSummary;
};

type OptimisticAction = 
  | { type: 'UPDATE_ITEMS'; items: CartItem[] }
  | { type: 'UPDATE_SUMMARY'; summary: Partial<CartSummary> }
  | { type: 'CLEAR' };

/**
 * Optimistic cart hook
 * Server Actions ile tam entegre, state management yok!
 */
export function useCart(initialCart: CartState) {
  const [isPending, startTransition] = useTransition();
  
  // Optimistic updates için - daha type-safe yaklaşım
  const [optimisticCart, setOptimisticCart] = useOptimistic(
    initialCart,
    (state: CartState, action: OptimisticAction): CartState => {
      switch (action.type) {
        case 'UPDATE_ITEMS':
          return { ...state, items: action.items };
        case 'UPDATE_SUMMARY':
          return { ...state, summary: { ...state.summary, ...action.summary } };
        case 'CLEAR':
          return {
            items: [],
            summary: {
              subtotal: 0,
              shippingCost: 0,
              total: 0,
              itemCount: 0,
              freeShippingThreshold: 500,
              remainingForFreeShipping: 500,
            },
          };
        default:
          return state;
      }
    }
  );

  /**
   * Sepete ürün ekle
   */
  const addToCart = async (productId: string, quantity: number = 1) => {
    startTransition(async () => {
      // Optimistic update
      setOptimisticCart({
        type: 'UPDATE_SUMMARY',
        summary: {
          itemCount: optimisticCart.summary.itemCount + quantity,
        },
      });

      const result = await addToCartAction(productId, quantity);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    });
  };

  /**
   * Miktar güncelle
   */
  const updateQuantity = async (itemId: string, quantity: number) => {
    startTransition(async () => {
      // Optimistic update
      const updatedItems = optimisticCart.items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      
      setOptimisticCart({
        type: 'UPDATE_ITEMS',
        items: updatedItems,
      });

      const result = await updateCartItemAction(itemId, quantity);
      
      if (!result.success) {
        throw new Error(result.error);
      }
    });
  };

  /**
   * Ürünü sil
   */
  const removeItem = async (itemId: string) => {
    startTransition(async () => {
      // Optimistic update
      const updatedItems = optimisticCart.items.filter(
        item => item.id !== itemId
      );
      
      setOptimisticCart({
        type: 'UPDATE_ITEMS',
        items: updatedItems,
      });

      const result = await removeCartItemAction(itemId);
      
      if (!result.success) {
        throw new Error(result.error);
      }
    });
  };

  /**
   * Sepeti temizle
   */
  const clearCart = async () => {
    startTransition(async () => {
      // Optimistic update
      setOptimisticCart({ type: 'CLEAR' });

      const result = await clearCartAction();
      
      if (!result.success) {
        throw new Error(result.error);
      }
    });
  };

  return {
    items: optimisticCart.items,
    summary: optimisticCart.summary,
    isPending,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  };
}