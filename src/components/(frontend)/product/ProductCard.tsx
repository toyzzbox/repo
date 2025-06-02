"use client";

import { useRouter } from "next/navigation";
import { formatPrice } from "@/utils/formatPrice";
import type { Product } from "@/types/product"; // Güncel tip buradan gelsin
import Image from "next/image";

type ProductCardProps = {
  product: Product;
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();

  const handleClick = () => {
    if (product.slug) {
      router.push(`/product/${product.slug}`);
    }
  };

  // İlk medya içindeki ilk URL'i al
  const imageUrl = product.medias?.[0]?.urls?.[0] ?? null;

  return (
    <div
      className="border rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-xl transition"
      onClick={handleClick}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          width={400}
          height={300}
          alt={product.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      ) : (
        <div className="w-full h-48 bg-gray-300 rounded-t-lg flex items-center justify-center text-white">
          No Image Available
        </div>
      )}

      <div className="text-center mt-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-md text-gray-600">{formatPrice(product.price)}</p>
      </div>
    </div>
  );
};
