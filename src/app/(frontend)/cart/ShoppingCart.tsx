"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { decrementQuantity, getCart, incrementQuantity, removeFromTheCart } from "@/redux/cartSlice";
import Image from "next/image";
import React, { useState } from "react";

export const ShoppingCart = () => {
  const cart = useAppSelector(getCart);
  const dispatch = useAppDispatch();
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({});
  
  let totalPrice = 0;
  cart.forEach((item: any) => {
    totalPrice += item.price * item.quantity;
  });

  const handleImageError = (productId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [productId]: true
    }));
  };

  return (
    <div className="w-[80%] p-5">
      <div className="flex justify-between items-center border-b border-gray-300 py-5">
        <h1 className="font-bold text-2xl">Alışveriş Listem</h1>
        <h1 className="font-medium text-lg">Fiyat</h1>
      </div>
      
      {cart.length > 0 ? (
        cart.map((product: any, index: number) => {
          const imageUrl = product.medias?.[0]?.urls?.[0] ?? null;
          const productKey = `${product.id || product.slug}-${index}`;
          const hasImageError = imageErrors[productKey];
          
          // Debug için konsola yazdır
          console.log(`Product ${product.name}:`, {
            imageUrl,
            hasError: hasImageError,
            medias: product.medias
          });
          
          return (
            <div
              className="mt-4 flex justify-between items-center border-b border-gray-200 py-4"
              key={productKey}
            >
              <div className="flex items-center">
                {imageUrl && !hasImageError ? (
                  // Next.js Image bileşeni
                  <div className="relative w-24 h-24 overflow-hidden rounded-md">
                    <Image
                      src={imageUrl}
                      fill
                      alt={product.name || "Ürün görseli"}
                      className="object-cover"
                      sizes="96px"
                      onError={() => {
                        console.error(`Image failed to load: ${imageUrl}`);
                        handleImageError(productKey);
                      }}
                      onLoad={() => {
                        console.log(`Image loaded successfully: ${imageUrl}`);
                      }}
                      // Next.js Image için ekstra props
                      unoptimized={false} // True yapmayı deneyin eğer sorun devam ederse
                      priority={index < 3} // İlk 3 görseli öncelikli yükle
                    />
                  </div>
                ) : imageUrl && hasImageError ? (
                  // Hata durumunda normal img tag'i dene
                  <div className="w-24 h-24 overflow-hidden rounded-md">
                    <img
                      src={imageUrl}
                      alt={product.name || "Ürün görseli"}
                      className="w-full h-full object-cover"
                      onError={() => {
                        console.error(`Regular img also failed: ${imageUrl}`);
                      }}
                    />
                  </div>
                ) : (
                  // Görsel yok
                  <div className="w-24 h-24 bg-gray-300 flex items-center justify-center rounded-md">
                    <span className="text-sm text-gray-600">No Image</span>
                  </div>
                )}
                
                <div className="ml-4">
                  <h1 className="font-medium text-lg">{product?.name}</h1>
                  <p className="text-green-500 text-sm">Stokta</p>
                  {/* Debug bilgisi - geliştirme sırasında görmek için */}
                  <p className="text-xs text-gray-400">
                    {imageUrl ? `URL: ${imageUrl.substring(0, 30)}...` : 'No URL'}
                  </p>
                  <h1
                    onClick={() => dispatch(removeFromTheCart(product.slug))}
                    className="font-bold text-red-600 cursor-pointer mt-2 hover:text-red-800 transition-colors"
                  >
                    Sil
                  </h1>
                </div>
              </div>
              
              <div className="flex items-center text-lg font-medium rounded-md bg-gray-200 px-4 py-1 mt-2">
                <button 
                  onClick={() => { 
                    product.quantity > 1 && dispatch(decrementQuantity(product)) 
                  }} 
                  className="cursor-pointer mr-4 hover:bg-gray-300 px-2 py-1 rounded transition-colors"
                  disabled={product.quantity <= 1}
                >
                  -
                </button>
                <span className="mx-2 min-w-[20px] text-center">{product.quantity}</span>
                <button 
                  onClick={() => { 
                    dispatch(incrementQuantity(product)) 
                  }} 
                  className="cursor-pointer ml-4 hover:bg-gray-300 px-2 py-1 rounded transition-colors"
                >
                  +
                </button>
              </div>
              
              <div className="text-right">
                <h1 className="font-bold text-2xl">{`${(product.price * product.quantity).toFixed(2)}TL`}</h1>
                <p className="text-xs text-gray-500">
                  Birim: {product.price}TL
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
      
      <div className="text-right mt-4 pt-4 border-t border-gray-300">
        <h1 className="text-xl">
          {`Ara Toplam (${cart.length} ürün): `}
          <span className="font-bold">{totalPrice.toFixed(2)}TL</span>
        </h1>
      </div>
    </div>
  );
};

export default ShoppingCart;