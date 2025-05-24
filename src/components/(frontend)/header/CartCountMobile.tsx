"use client";

import { useAppSelector } from "@/hooks/redux";
import { getCart } from "@/redux/cartSlice";
import { useRouter } from "next/navigation";
import { CiShoppingCart } from "react-icons/ci";

const CartCountMobile = () => {
  const router = useRouter();
  const cart = useAppSelector(getCart);

  return (
    <div
      className="relative cursor-pointer flex items-center"
      onClick={() => router.push("/cart")}
    >
      <div className="text-3xl">
        <CiShoppingCart />
      </div>
      <span
        className="absolute 
        top-[-10px] 
        right-[-10px] 
        bg-orange-600 
        text-white 
        h-6 
        w-6 
        rounded-full 
        flex items-center justify-center text-sm"
      >
        {cart.length}
      </span>
    </div>
  );
};

export default CartCountMobile;
