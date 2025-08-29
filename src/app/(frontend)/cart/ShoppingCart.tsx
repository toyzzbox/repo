"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  decrementQuantity,
  getCart,
  incrementQuantity,
  removeFromTheCart,
} from "@/redux/cartSlice";
import { Media } from "@/types/product";
import Image from "next/image";
import React, { useMemo } from "react";

// 🟢 Tekil ürün bileşeni - Gereksiz re-render'ı önlemek için React.memo
const CartItem = React.memo(({ product, dispatch }: { product: any; dispatch: any }) => {
  const price = product.discountedPrice ?? product.price;
  const isDiscounted = product.discountedPrice != null;
  const getFirstImageUrl = (medias?: Media[]): string | null => {
    return medias?.[0]?.urls?.[0] ?? null;
  };
  const displayName = product.group?.name
    ? `${product.group.name} – ${product.name}`
    : product.name;

  return (
    <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-200 py-4 gap-4">
      {/* Ürün ve Bilgiler */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      {getFirstImageUrl ? (
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
        {/* Ürün Bilgileri */}
        <div>
          <h1 className="font-medium text-md sm:text-lg">{product?.name}</h1>
          <p className="text-green-500 text-sm">Stokta</p>
          <button
            onClick={() => dispatch(removeFromTheCart(product.slug))}
            className="text-red-600 text-sm mt-2 hover:underline"
          >
            Sil
          </button>
        </div>
      </div>

      {/* Adet ve Fiyat */}
      <div className="flex items-center justify-between sm:justify-normal sm:gap-4 mt-2 sm:mt-0">
        <div className="flex items-center text-md font-medium rounded-md bg-gray-200 px-3 py-1">
          <button
            onClick={() => {
              product.quantity > 1 && dispatch(decrementQuantity(product));
            }}
            className="cursor-pointer px-2 text-lg"
          >
            -
          </button>
          <span className="px-2">{product.quantity}</span>
          <button
            onClick={() => dispatch(incrementQuantity(product))}
            className="cursor-pointer px-2 text-lg"
          >
            +
          </button>
        </div>
        <div className="text-right ml-4">
          <h1 className="font-bold text-lg sm:text-xl">
            {(price * product.quantity).toFixed(2)} TL
          </h1>
          {isDiscounted && (
            <p className="text-xs text-gray-500 line-through">
              {(product.price * product.quantity).toFixed(2)} TL
            </p>
          )}
          <p className="text-xs text-gray-500">Birim: {price.toFixed(2)} TL</p>
        </div>
      </div>
    </div>
  );
});

export const ShoppingCart = () => {
  const cart = useAppSelector(getCart);
  const dispatch = useAppDispatch();

  const totalPrice = useMemo(() => {
    return cart.reduce(
      (total, product) =>
        total + (product.discountedPrice ?? product.price) * product.quantity,
      0
    );
  }, [cart]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Başlık */}
      <div className="flex justify-between items-center border-b border-gray-300 py-4">
        <h1 className="font-bold text-xl sm:text-2xl">Alışveriş Listem</h1>
        <h1 className="font-medium text-md sm:text-lg">Fiyat</h1>
      </div>

      {/* Ürünler */}
      {cart.length > 0 ? (
        cart.map((product: any) => (
          <CartItem key={product.slug} product={product} dispatch={dispatch} />
        ))
      ) : (
        <div className="text-center py-10">
          <h1 className="text-gray-500 text-lg sm:text-xl">Sepetiniz boş!</h1>
        </div>
      )}

      {/* Ara Toplam */}
      <div className="mt-6 text-right">
        <h1 className="text-md sm:text-lg">
          Ara Toplam ({cart.length} ürün):{" "}
          <span className="font-bold text-xl sm:text-2xl">
            {totalPrice.toFixed(2)} TL
          </span>
        </h1>
      </div>
    </div>
  );
};

export default ShoppingCart;
