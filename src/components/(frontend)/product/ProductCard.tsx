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

  // ✅ Yeni Media yapısına uygun: ProductMedia → Media → Files → url
  const imageUrl =
    product.medias?.[0]?.media?.files?.[0]?.url ?? "/placeholder.png";

  const displayName = product.group?.name
    ? `${product.group.name} – ${product.name}`
    : product.name;

  const hasDiscount =
    typeof product.discount === "number" &&
    product.discount > 0 &&
    product.discount < product.price;

  const discountedPrice = hasDiscount ? product.discount : null;

  // 💡 İndirim yüzdesi hesaplama
  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.discount) / product.price) * 100)
    : 0;

  return (
    <div
      className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg cursor-pointer transition-all duration-300 hover:border-orange-400 hover:-translate-y-1 group overflow-hidden h-full flex flex-col"
      onClick={handleClick}
    >
      {/* 🖼️ Resim Kısmı */}
      <div className="relative overflow-hidden rounded-t-xl bg-gray-50">
        {/* İndirim Badge */}
        {/* {hasDiscount && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
              %{discountPercentage} İNDİRİM
            </span>
          </div>
        )} */}

        {imageUrl ? (
          <div className="aspect-square overflow-hidden">
            <Image
              src={imageUrl}
              width={400}
              height={400}
              alt={displayName}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              priority={false}
            />
          </div>
        ) : (
          <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-500 font-medium">
            Resim Yok
          </div>
        )}
      </div>

      {/* İçerik */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <h3
            className="text-sm font-semibold text-gray-800 leading-tight mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors duration-200"
            title={displayName}
          >
            {displayName}
          </h3>
        </div>

        {/* 💰 Fiyat Alanı */}
        <div className="h-16 flex flex-col justify-end space-y-1">
          {hasDiscount && discountedPrice !== null ? (
            <>
              {/* Eski fiyat + indirim yüzdesi */}
              <div className="flex items-center justify-between">
                <span className="text-xs line-through text-gray-400">
                  {formatPrice(product.price)}
                </span>
                <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded">
                  %{discountPercentage}
                </span>
              </div>

              {/* Yeni fiyat */}
              <div>
                <span className="text-lg font-bold text-red-600">
                  {formatPrice(discountedPrice)}
                </span>
              </div>
            </>
          ) : (
            <div className="flex flex-col justify-end h-full">
              <div className="h-6" />
              <span className="text-lg font-bold text-gray-800">
                {formatPrice(product.price)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Hover alt çizgi efekti */}
      <div className="h-1 bg-gradient-to-r from-orange-400 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </div>
  );
};
