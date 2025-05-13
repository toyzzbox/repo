"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { decrementQuantity, getCart, incrementQuantity, removeFromTheCart } from "@/redux/cartSlice";
import Image from "next/image";
import React from "react";

export const ShoppingCart = () => {
  const cart = useAppSelector(getCart); // Sepet öğelerini Redux store'dan alıyoruz
  const dispatch = useAppDispatch(); // Redux işlemleri için dispatch fonksiyonu

  let totalPrice = 0;

  cart.forEach((item: any) => {
    totalPrice += item.price * item.quantity;
  });

  return (
    <div className="w-[80%] p-5">
      <div className="flex justify-between items-center border-b border-gray-300 py-5">
        <h1 className="font-bold text-2xl">Alışveriş Listem</h1>
        <h1 className="font-medium text-lg">Fiyat</h1>
      </div>

      {cart.length > 0 ? (
        cart.map((product: any, index: number) => { // İndeksi de alıyoruz
          return (
            <div
              className="mt-4 flex justify-between items-center border-b border-gray-200 py-4"
              key={`${product.id || product.slug}-${index}`} // Benzersiz key
            >
              <div className="flex items-center">
                {/* İlk fotoğrafı gösteriyoruz */}
                {product?.urls && product.urls.length > 0 ? (
                  <Image
                    src={product.urls[0]} // İlk fotoğrafı alıyoruz
                    width={100}
                    height={100}
                    alt={product?.name || "Ürün görseli"}
                    className="rounded-md"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-300 flex items-center justify-center rounded-md">
                    <span className="text-sm text-gray-600">No Image</span>
                  </div>
                )}
                <div className="ml-4">
                  <h1 className="font-medium text-lg">{product?.name}</h1>
                  <p className="text-green-500 text-sm">In Stock</p>
                  <h1
                    onClick={() => dispatch(removeFromTheCart(product.slug))}
                    className="font-bold text-red-600 cursor-pointer mt-2"
                  >
                    Sil
                  </h1>
                </div>
              </div>
              <div className="flex items-center text-lg font-medium rounded-md bg-gray-200 px-4 py-1 mt-2">
                <div onClick={() => { product.quantity > 1 && dispatch(decrementQuantity(product)) }} className="cursor-pointer mr-4">-</div>
                <span>{product.quantity}</span>
                <div onClick={() => { dispatch(incrementQuantity(product)) }} className="cursor-pointer ml-4">+</div>
              </div>
              <div className="text-right">
                <h1 className="font-bold text-2xl">{`$${product.price}`}</h1>
                <p className="text-xs text-gray-500">
                  TL: <span className="line-through">indirimli fiyat</span>
                </p>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center py-10">
          <h1 className="text-gray-500 text-xl">Sepetiniz boş!</h1>
        </div>
      )}
      <h1 className="text-right">{`Subtotal (${cart.length} items): `}<span className="font-bold">{totalPrice}</span> </h1>
    </div>
  );
};

export default ShoppingCart;
