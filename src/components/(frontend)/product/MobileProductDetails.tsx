"use client";

import { useAppDispatch } from "@/hooks/redux";
import { addToCart } from "@/redux/cartSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HeartIcon } from "lucide-react";
import ProductImageGallery from "./ProductImageGallery";
import { ProductDetailTabs } from "./ProductDetailTab";

export default function MobileProductDetails({ product }: { product: any }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  const variants = product.group?.products ?? [];
  const [selectedVariant, setSelectedVariant] = useState<typeof variants[0] | null>(
    variants.find((v) => v.id === product.id) ?? null
  );

  useEffect(() => {
    setSelectedVariant(variants.find((v) => v.id === product.id) ?? null);
  }, [product]);

  const activeVariant = selectedVariant ?? product;

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: activeVariant.id,
        slug: activeVariant.slug,
        name: activeVariant.name,
        price: activeVariant.price,
        quantity,
        url: activeVariant.medias?.[0]?.urls?.[0] ?? "",
      })
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/cart");
  };

  const imageUrls =
    activeVariant?.medias?.length && activeVariant?.medias[0]?.urls?.length
      ? activeVariant.medias.map((m: any) => m.urls[0])
      : product.medias.map((m: any) => m.urls[0]);

  return (
    <>
      {/* Galeri + Beğenme Butonu */}
      <div className="relative">
        <ProductImageGallery
          images={imageUrls}
          productName={activeVariant.name}
        />
        <button className="absolute top-2 right-2 bg-white rounded-full p-2 shadow">
          <HeartIcon className="w-6 h-6 text-red-500" />
        </button>
      </div>

      {/* Ürün Bilgileri */}
      <div className="p-4 pb-24 text-slate-600 text-sm">
        <h1 className="text-2xl font-semibold text-slate-800">
          {product.group?.name
            ? `${product.group.name} – ${activeVariant.name}`
            : activeVariant.name}
        </h1>

        {/* Varyantlar */}
        {variants.length > 1 && (
          <div className="mt-4 space-y-2">
            {variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => router.push(`/product/${variant.slug}`)}
                className={`w-full text-left border rounded px-4 py-2 ${
                  activeVariant.id === variant.id
                    ? "border-orange-500 bg-orange-100"
                    : "border-gray-300"
                }`}
              >
                {variant.name}
              </button>
            ))}
          </div>
        )}

        {/* Adet Seçici */}
        <div className="mt-4 flex items-center gap-4">
          <span className="text-sm font-medium">Adet:</span>
          <div className="flex items-center bg-gray-200 rounded px-3 py-1">
            <button onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))} className="px-2 text-lg">-</button>
            <span className="px-3">{quantity}</span>
            <button onClick={() => setQuantity((q) => q + 1)} className="px-2 text-lg">+</button>
          </div>
        </div>

        {/* Fiyat */}
        <div className="mt-4">
          <h2 className="text-xl font-bold text-black">
            {(activeVariant.price * quantity).toFixed(2)} TL
          </h2>
        </div>

        {/* Tabs: Açıklama / Yorum / Soru */}
        <div className="mt-6">
          <ProductDetailTabs
            description={product.description}
            comments={<div>Henüz yorum yok.</div>}
            questions={<div>Henüz soru yok.</div>}
          />
        </div>
      </div>

      {/* Alt Sabit Buton */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t px-4 py-3 shadow md:hidden">
        <button
          onClick={handleAddToCart}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition duration-200"
        >
          Sepete Ekle ({quantity})
        </button>
      </div>
    </>
  );
}
