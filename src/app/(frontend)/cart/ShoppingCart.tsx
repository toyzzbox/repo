"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  decrementQuantity,
  getCart,
  incrementQuantity,
  removeFromTheCart,
} from "@/redux/cartSlice";
import React from "react";

interface CartItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  urls?: string[];
}

export const ShoppingCart = () => {
  const cart = useAppSelector(getCart) as CartItem[];
  const dispatch = useAppDispatch();

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="w-[80%] p-5">
      <div className="flex justify-between items-center border-b border-gray-300 py-5">
        <h1 className="font-bold text-2xl">Alışveriş Listem</h1>
        <h1 className="font-medium text-lg">Fiyat</h1>
      </div>

      {cart.length > 0 ? (
        cart.map((product, index) => (
          <div
            className="mt-4 flex justify-between items-center border-b border-gray-200 py-4"
            key={`${product.id || product.slug}-${index}`}
          >
            <div className="flex items-center">
         
              
                <div className="w-24 h-24 bg-gray-300 flex items-center justify-center rounded-md">
                  <span className="text-sm text-gray-600">No Image</span>
                </div>
            
              <div className="ml-4">
                <h1 className="font-medium text-lg">{product.name}</h1>
                <p className="text-green-500 text-sm">Stokta</p>
                <h1
                  onClick={() => dispatch(removeFromTheCart(product.slug))}
                  className="font-bold text-red-600 cursor-pointer mt-2"
                >
                  Sil
                </h1>
              </div>
            </div>
            <div className="flex items-center text-lg font-medium rounded-md bg-gray-200 px-4 py-1 mt-2">
              <button
                onClick={() => {
                  if (product.quantity > 1) {
                    dispatch(decrementQuantity(product));
                  }
                }}
                className="cursor-pointer mr-4"
              >
                -
              </button>
              <span>{product.quantity}</span>
              <button
                onClick={() => {
                  dispatch(incrementQuantity(product));
                }}
                className="cursor-pointer ml-4"
              >
                +
              </button>
            </div>
            <div className="text-right">
              <h1 className="font-bold text-2xl">{`₺${product.price}`}</h1>
              <p className="text-xs text-gray-500">
                TL: <span className="line-through">indirimli fiyat</span>
              </p>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-10">
          <h1 className="text-gray-500 text-xl">Sepetiniz boş!</h1>
        </div>
      )}
      <h1 className="text-right">
        {`Toplam (${cart.length} ürün): `}
        <span className="font-bold">₺{totalPrice.toFixed(2)}</span>
      </h1>
    </div>
  );
};

export default ShoppingCart;
