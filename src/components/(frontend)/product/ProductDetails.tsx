"use client";

import { useAppDispatch } from "@/hooks/redux";
import { addToCart } from "@/redux/cartSlice";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Link from "next/link"; // ✅ doğru import

const Horizontal = () => <hr className="w-[30%] my-2" />;

interface ProductDetailsProps {
  product: {
    id: string;
    slug: string;
    name: string;
    description: string;
    price: number;
    medias: {
      urls: string[];
    }[];
    categories?: {
      id: string;
      name: string;
    }[];
  };
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    console.log("Current Product:", product);
  }, [product]);

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity }));
  };

  const handleBuyNow = () => {
    dispatch(addToCart({ ...product, quantity }));
    router.push("/cart");
  };

  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const imageUrl = product.medias?.[0]?.urls?.[0] ?? null;

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
        <span className="text-gray-900 font-medium">{product.name}</span>
      </div>

      {/* Ana içerik */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
        {/* Görsel */}
        <div>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="rounded-lg w-full max-h-[400px] object-contain border"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">
              No Image Available
            </div>
          )}
        </div>

        {/* Bilgi */}
        <div className="flex flex-col gap-4 text-slate-600 text-sm">
          <h2 className="text-3xl font-semibold text-slate-800">{product.name}</h2>
          <div className="flex items-center gap-2">
            <span>⭐</span>
            <span>4.5 / 5</span>
          </div>
          <p className="text-justify">{product.description}</p>
          <Horizontal />

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
          <div className="text-right mt-2">
            <h1 className="text-2xl font-bold text-blue-600">
              {`$${(product.price * quantity).toFixed(2)}`}
            </h1>
            <p className="text-xs text-gray-400">
              TL karşılığı: <span className="line-through">İndirimli Fiyat</span>
            </p>
          </div>
          <Horizontal />

          {/* Butonlar */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
