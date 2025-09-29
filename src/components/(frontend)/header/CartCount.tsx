"use client";

import { useRouter } from "next/navigation";
import { CiShoppingCart } from "react-icons/ci";
import { useEffect, useState } from "react";
import { getCartCount } from "@/actions/cart";

const CartCount = () => {
  const router = useRouter();
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // İlk yüklemede sepet sayısını al
    loadCartCount();

    // Custom event listener - sepet güncellendiğinde çalışır
    const handleCartUpdate = () => {
      loadCartCount();
    };

    window.addEventListener('cart-updated', handleCartUpdate);

    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
    };
  }, []);

  const loadCartCount = async () => {
    try {
      const cartCount = await getCartCount();
      setCount(cartCount);
    } catch (error) {
      console.error("Cart count error:", error);
      setCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="cursor-pointer flex items-center gap-2"
      onClick={() => router.push("/cart")}
    >
      {/* Icon + Badge Wrapper */}
      <div className="relative text-3xl">
        <CiShoppingCart />
        {!isLoading && count > 0 && (
          <span
            className="absolute
              -top-3
              right-2
              z-10
              bg-orange-600
              text-white
              h-5
              w-5
              rounded-full
              flex items-center justify-center
              text-xs
              font-semibold"
          >
            {count > 99 ? '99+' : count}
          </span>
        )}
      </div>
      <span>Sepetim</span>
    </div>
  );
};

export default CartCount;