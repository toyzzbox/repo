"use client";

import { useRouter } from "next/navigation";
import { formatPrice } from "@/utils/formatPrice";
import type { Product } from "@/types/product";
import Image from "next/image";

type ProductCardProps = {
  product: Product;
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();

  const handleClick = () => {
    if (product.slug) {
      router.push(`/${product.slug}`);
    }
  };

  // ✅ Doğru erişim: ProductMedia → Media → urls
  const imageUrl = product.medias?.[0]?.media?.urls?.[0] ?? null;

  const displayName = product.group?.name
    ? `${product.group.name} – ${product.name}`
    : product.name;

  const hasDiscount =
    typeof product.discount === "number" &&
    product.discount > 0 &&
    product.discount < product.price;

  const discountedPrice = hasDiscount ? product.discount : null;

  return (
    <div
      className="border border-gray-200 rounded-lg shadow-md p-4 cursor-pointer transition-colors duration-300 hover:border-orange-500 group"
      onClick={handleClick}
    >
      {imageUrl ? (
        <div className="overflow-hidden rounded-t-lg">
          <Image
            src={imageUrl}
            width={400}
            height={300}
            alt={displayName}
            className="w-full h-48 object-contain transition-opacity duration-300 group-hover:opacity-90"
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-gray-300 rounded-t-lg flex items-center justify-center text-white">
          No Image Available
        </div>
      )}

      <div className="text-center mt-4">
        <h3
          className="truncate max-w-[250px] mx-auto text-lg font-semibold transition group-hover:text-primary"
          title={displayName}
        >
          {displayName}
        </h3>

        {hasDiscount && discountedPrice !== null ? (
          <div className="flex justify-center gap-2 items-center mt-1">
            <span className="text-lg font-bold text-red-600">
              {formatPrice(discountedPrice)}
            </span>
            <span className="text-sm line-through text-gray-500">
              {formatPrice(product.price)}
            </span>
          </div>
        ) : (
          <p className="text-md text-gray-600 mt-1">
            {formatPrice(product.price)}
          </p>
        )}
      </div>
    </div>
  );
};
