"use client";

import { useTransition } from "react";
import { addToCart } from "@/actions/cart";

export default function AddToCartButton({ userId, productId }: { userId: string, productId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = () => {
    startTransition(async () => {
      await addToCart(userId, productId, 1);
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isPending}
      className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
    >
      {isPending ? "Ekleniyor..." : "Sepete Ekle"}
    </button>
  );
}
