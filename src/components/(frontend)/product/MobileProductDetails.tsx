"use client";

import { useAppDispatch } from "@/hooks/redux";
import { addToCart } from "@/redux/cartSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HeartIcon } from "lucide-react";
import ProductImageGallery from "./ProductImageGallery";
import ProductDetailTabsMobile from "./ProductDetailTabsMobile";
import Image from "next/image";
import ProductBreadcrumb from "./ProductBreadcrumb";
import RelatedProducts from "./RelatedProducts";

interface MobileProductDetailsProps {
  product: any;
  relatedProducts: any[];
}

export default function MobileProductDetails({
  product,
  relatedProducts,
}: MobileProductDetailsProps) {
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
        <ProductBreadcrumb
          category={product.categories?.[0]}
          groupName={product.group?.name}
          productName={activeVariant.name}
        />
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

        {variants.length > 1 && (
          <div className="flex gap-2 flex-wrap mt-4">
            {variants.map((variant) => (
              <div key={variant.id} className="text-center">
                <button
                  type="button"
                  onClick={() => router.push(`/product/${variant.slug}`)}
                  className={`border rounded px-3 py-2 flex flex-col items-center gap-1 w-24 ${
                    activeVariant.id === variant.id
                      ? "border-orange-500 bg-orange-100"
                      : "border-gray-300"
                  }`}
                >
                  <div className="w-full h-16 relative">
                    <Image
                      src={variant.medias?.[0]?.urls?.[0] || "/placeholder.png"}
                      alt={variant.name}
                      fill
                      className="object-cover rounded"
                      sizes="96px"
                    />
                  </div>
                  <span className="text-xs">{variant.name}</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Fiyat */}
        <div className="mt-4">
          <h2 className="text-xl font-bold text-black">
            {(activeVariant.price * quantity).toFixed(2)} TL
          </h2>
        </div>

        {/* Tabs: Açıklama / Yorum / Soru */}
        <div className="mt-6">
          <ProductDetailTabsMobile
            description={product.description}
            comments={<div>Henüz yorum yok.</div>}
            questions={<div>Henüz soru yok.</div>}
          />
        </div>

        {/* ✅ Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-10">
            <RelatedProducts products={relatedProducts} />
          </div>
        )}
      </div>

      {/* Alt Sabit Buton */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t px-4 py-3 shadow md:hidden">
        <button
          onClick={handleAddToCart}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition duration-200 m-2"
        >
          Sepete Ekle
        </button>
      </div>
    </>
  );
}
