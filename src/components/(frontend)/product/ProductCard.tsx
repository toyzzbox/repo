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
  
  // İndirim yüzdesi hesaplama
  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.discount) / product.price) * 100)
    : 0;

  return (
    <div
      className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg cursor-pointer transition-all duration-300 hover:border-orange-400 hover:-translate-y-1 group overflow-hidden h-full flex flex-col"
      onClick={handleClick}
    >
      {/* Resim Kısmı */}
      <div className="relative overflow-hidden rounded-t-xl bg-gray-50">
        {/* İndirim Badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
              %{discountPercentage} İNDİRİM
            </span>
          </div>
        )}
        
        {imageUrl ? (
          <div className="aspect-square overflow-hidden">
            <Image
              src={imageUrl}
              width={400}
              height={400}
              alt={displayName}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-500 font-medium">
            Resim Yok
          </div>
        )}
      </div>

      {/* İçerik Kısmı */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <h3
            className="text-sm font-semibold text-gray-800 leading-tight mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors duration-200"
            title={displayName}
          >
            {displayName}
          </h3>
        </div>

        {/* Fiyat Kısmı - Sabit yükseklik */}
        <div className="h-16 flex flex-col justify-end space-y-1">
          {hasDiscount && discountedPrice !== null ? (
            <>
              {/* Eski fiyat ve indirim oranı - YUKARDA */}
              <div className="flex items-center justify-between">
                <span className="text-xs line-through text-gray-400">
                  {formatPrice(product.price)}
                </span>
                <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded">
                  %{discountPercentage} İndirim
                </span>
              </div>
              
              {/* İndirimli fiyat - AŞAĞIDA */}
              <div>
                <span className="text-lg font-bold text-red-600">
                  {formatPrice(discountedPrice)}
                </span>
              </div>
            </>
          ) : (
            <div className="flex flex-col justify-end h-full">
              {/* Boş alan - yükseklik tutarlılığı için */}
              <div className="h-6"></div>
              <span className="text-lg font-bold text-gray-800">
                {formatPrice(product.price)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Hover Efekti için Alt Border */}
      <div className="h-1 bg-gradient-to-r from-orange-400 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
    </div>
  );
};