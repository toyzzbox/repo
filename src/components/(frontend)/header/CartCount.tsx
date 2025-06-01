"use client";

import { useAppSelector } from "@/hooks/redux";
import { getCart } from "@/redux/cartSlice";
import { useRouter } from "next/navigation";
import { CiShoppingCart } from "react-icons/ci";

const CartCount = () => {
  const router = useRouter();
  const cart = useAppSelector(getCart);

  return (
    <div
      className="cursor-pointer flex items-center gap-2"
      onClick={() => router.push("/cart")}
    >
      {/* Icon + Badge Wrapper */}
      <div className="relative text-3xl">
        <CiShoppingCart />
        <span
          className="absolute 
          -top-2 
          -right-2 
          bg-orange-600 
          text-white 
          h-5 
          w-5 
          rounded-full 
          flex items-center justify-center text-xs"
        >
          {cart.length}
        </span>
      </div>

      <span className="">Sepetim</span>
    </div>
  );
};

export default CartCount;
