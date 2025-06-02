"use client";

import { useAppDispatch } from "@/hooks/redux";
import { addToCart } from "@/redux/cartSlice";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ProductDetailTabs } from "./ProductDetailTab";
import { HeartIcon } from "lucide-react";
import ProductImageGallery from "./ProductImageGallery";
import Image from "next/image";

interface ProductDetailsProps {
  product: {
    id: string;
    slug: string;
    name: string;
    description: string;
    price: number;
    medias: { urls: string[] }[];
    categories?: { id: string; name: string }[];
    group?: {
      name: string;
      products: {
        id: string;
        slug: string;
        name: string;
        price: number;
        stock?: number | null;
        medias: { urls: string[] }[];
      }[];
    };
  };
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
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

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    dispatch(
      addToCart({
        id: selectedVariant.id,
        slug: selectedVariant.slug,
        name: selectedVariant.name,
        price: selectedVariant.price,
        quantity,
        url: selectedVariant.medias?.[0]?.urls?.[0] ?? "",
      })
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/cart");
  };

  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const imageUrls = selectedVariant?.medias.map((m) => m.urls[0]) ?? [];

  return (
    <div className="p-4">
      {/* Breadcrumb */}
      <div className="py-2 px-4 rounded-md text-sm text-gray-600">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        {product?.categories?.length ? (
          <>
            <Link
              href={`/category/${product.categories[0].id}`}
              className="hover:text-gray-800"
            >
              {product.categories[0].name}
            </Link>
            <span className="mx-2">/</span>
          </>
        ) : (
          <>
            <span>Kategori Yok</span>
            <span className="mx-2">/</span>
          </>
        )}
        <span className="text-gray-900 font-medium">
          {product.group?.name ? `${product.group.name} – ${selectedVariant?.name}` : selectedVariant?.name}
        </span>
      </div>

      {/* Ana içerik */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
        <ProductImageGallery images={imageUrls} productName={selectedVariant?.name ?? product.name} />

        <div className="flex flex-col gap-4 text-slate-600 text-sm">
          <h2 className="text-3xl font-semibold text-slate-800">
            {product.group?.name ? `${product.group.name} – ${selectedVariant?.name}` : selectedVariant?.name}
          </h2>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <span>⭐</span>
            <span>4.5 / 5</span>
          </div>

          {/* Varyant Seçici */}
 {variants.length > 1 && (
  <div className="flex gap-2 flex-wrap">
    {variants.map((variant) => (
      <div key={variant.id} className="text-center">
        <button
          type="button"
          onClick={() => router.push(`/product/${variant.slug}`)}
          className={`border rounded px-3 py-2 flex flex-col items-center gap-1 w-24 ${
            selectedVariant?.id === variant.id
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
              sizes="96px" // w-24 = 96px
            />
          </div>
          <span className="text-xs">{variant.name}</span>
        </button>
      </div>
    ))}
  </div>
)}

          {/* Adet Seçici */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Adet:</span>
            <div className="flex items-center bg-gray-200 rounded px-3 py-1">
              <button onClick={decrementQuantity} className="px-2 text-lg">-</button>
              <span className="px-3">{quantity}</span>
              <button onClick={incrementQuantity} className="px-2 text-lg">+</button>
            </div>
          </div>

          {/* Fiyat */}
          <div className="mt-2">
            <h1 className="text-2xl font-bold text-black">
              {(selectedVariant?.price ?? 0 * quantity).toFixed(2)} TL
            </h1>
            <p className="text-xs text-gray-400">
              <span className="line-through">İndirimli Fiyat</span>
            </p>
          </div>

          {/* Butonlar */}
          <div className="flex gap-4">
            <button
              onClick={handleBuyNow}
              className="bg-white border border-orange-400 hover:bg-orange-600 text-orange-400 py-4 px-6 rounded"
            >
              Şimdi Al
            </button>
            <button
              onClick={handleAddToCart}
              className="bg-orange-500 text-white py-2 px-4 rounded"
            >
              Sepete Ekle
            </button>
            <button className="p-2 rounded-full hover:bg-red-100 transition">
              <HeartIcon className="w-6 h-6 text-red-500" />
            </button>
          </div>

          {/* Açıklama, yorum vs */}
          <ProductDetailTabs
            description={product.description}
            comments={<div>Henüz yorum bulunmamaktadır.</div>}
            questions={<div>Henüz soru bulunmamaktadır.</div>}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
