"use client";
import { CiShoppingCart } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";

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

interface CartCountProps {
  initialCart: CartState;
}

const CartCount = ({ initialCart }: CartCountProps) => {
  const router = useRouter();
  const { summary } = useCart(initialCart);

  return (
    <div
      className="cursor-pointer flex items-center gap-2"
      onClick={() => router.push("/cart")}
    >
      <div className="relative">
        <CiShoppingCart className="text-3xl" />
        {summary.itemCount > 0 && (
          <span className="absolute -top-2 -right-2 z-10 bg-orange-600 text-white h-5 w-5 rounded-full flex items-center justify-center text-xs font-semibold">
            {summary.itemCount > 99 ? "99+" : summary.itemCount}
          </span>
        )}
      </div>
      <span>Sepetim</span>
    </div>
  );
};

export default CartCount;