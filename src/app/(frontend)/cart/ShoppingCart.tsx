"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  decrementQuantity,
  getCart,
  incrementQuantity,
  removeFromTheCart,
  setCart, // Redux'a guest cart'ı yüklemek için
} from "@/redux/cartSlice";
import Image from "next/image";
import React, { useMemo, useEffect, useState } from "react";
import { toast } from "sonner";

// Guest Cart Interface
interface GuestCartItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  imageUrl?: string;
  addedAt: string;
}

// Guest Cart Helper Functions
const getGuestCart = (): GuestCartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const cart = localStorage.getItem('guestCart');
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
};

const setGuestCart = (cart: GuestCartItem[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('guestCart', JSON.stringify(cart));
  } catch (error) {
    console.error('Guest cart kaydetme hatası:', error);
  }
};

// Guest cart item'ı Redux formatına çevir
const convertGuestToReduxFormat = (guestItem: GuestCartItem) => ({
  id: guestItem.productId,
  slug: guestItem.productId, // Redux'ta slug kullanıyorsun
  name: guestItem.productName,
  price: guestItem.price,
  discountedPrice: null,
  quantity: guestItem.quantity,
  image: guestItem.imageUrl,
  medias: guestItem.imageUrl ? [{ urls: [guestItem.imageUrl] }] : [],
});

// Redux item'ı guest formatına çevir
const convertReduxToGuestFormat = (reduxItem: any): GuestCartItem => ({
  productId: reduxItem.id || reduxItem.slug,
  productName: reduxItem.name,
  quantity: reduxItem.quantity,
  price: reduxItem.discountedPrice ?? reduxItem.price,
  imageUrl: reduxItem.image || reduxItem.medias?.[0]?.urls?.[0],
  addedAt: new Date().toISOString(),
});

// 🟢 Tekil ürün bileşeni - Gereksiz re-render'ı önlemek için React.memo
const CartItem = React.memo(({ 
  product, 
  dispatch, 
  isGuest, 
  onGuestUpdate 
}: { 
  product: any; 
  dispatch: any; 
  isGuest: boolean;
  onGuestUpdate?: () => void;
}) => {
  const price = product.discountedPrice ?? product.price;
  const isDiscounted = product.discountedPrice != null;

  // ✅ Çoklu fallback - ProductDetails'deki yapıya uygun
  const imageUrl = 
    product.image || // ✅ Ana field - addToCart'da kullandığınız
    product.medias?.[0]?.media?.urls?.[0] || // ProductCard yapısı
    product.medias?.[0]?.urls?.[0] || // ProductDetails yapısı
    product.url || // Fallback
    null;

  const handleIncrement = () => {
    if (isGuest) {
      const guestCart = getGuestCart();
      const itemIndex = guestCart.findIndex(item => item.productId === product.slug);
      if (itemIndex > -1) {
        guestCart[itemIndex].quantity += 1;
        setGuestCart(guestCart);
        onGuestUpdate?.();
      }
    } else {
      dispatch(incrementQuantity(product));
    }
  };

  const handleDecrement = () => {
    if (product.quantity > 1) {
      if (isGuest) {
        const guestCart = getGuestCart();
        const itemIndex = guestCart.findIndex(item => item.productId === product.slug);
        if (itemIndex > -1) {
          guestCart[itemIndex].quantity -= 1;
          setGuestCart(guestCart);
          onGuestUpdate?.();
        }
      } else {
        dispatch(decrementQuantity(product));
      }
    }
  };

  const handleRemove = () => {
    if (isGuest) {
      const guestCart = getGuestCart().filter(item => item.productId !== product.slug);
      setGuestCart(guestCart);
      onGuestUpdate?.();
      toast.success('Ürün sepetten kaldırıldı');
    } else {
      dispatch(removeFromTheCart(product.slug));
    }
  };

  return (
    <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-200 py-4 gap-4">
      {/* Ürün ve Bilgiler */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {imageUrl ? (
          <Image
            src={imageUrl}
            width={80}
            height={80}
            alt={product.name || "Ürün görseli"}
            className="rounded-md object-cover"
            loading="lazy"
            onError={(e) => {
              console.error("Image load error:", e);
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-[80px] h-[80px] bg-gray-300 flex items-center justify-center text-white rounded-md">
            No Image
          </div>
        )}

        {/* Ürün Bilgileri */}
        <div>
          <h1 className="font-medium text-md sm:text-lg">{product?.name}</h1>
          <p className="text-green-500 text-sm">Stokta</p>
          <button
            onClick={handleRemove}
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
            onClick={handleDecrement}
            className="cursor-pointer px-2 text-lg"
            disabled={product.quantity <= 1}
          >
            -
          </button>
          <span className="px-2">{product.quantity}</span>
          <button
            onClick={handleIncrement}
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

// CartItem'a displayName ekleme
CartItem.displayName = 'CartItem';

interface ShoppingCartProps {
  userId?: string; // Kullanıcı ID'si varsa database cart, yoksa guest cart
}

export const ShoppingCart: React.FC<ShoppingCartProps> = ({ userId }) => {
  const cart = useAppSelector(getCart);
  const dispatch = useAppDispatch();
  const [isGuest, setIsGuest] = useState(false);
  const [guestCartLoaded, setGuestCartLoaded] = useState(false);

  // Guest cart'ı Redux'a yükle
  useEffect(() => {
    if (!userId && !guestCartLoaded) {
      const guestCart = getGuestCart();
      if (guestCart.length > 0) {
        const reduxFormattedCart = guestCart.map(convertGuestToReduxFormat);
        dispatch(setCart(reduxFormattedCart));
      }
      setIsGuest(true);
      setGuestCartLoaded(true);
    } else if (userId) {
      setIsGuest(false);
    }
  }, [userId, dispatch, guestCartLoaded]);

  // Guest cart güncellendiğinde Redux'ı senkronize et
  const handleGuestCartUpdate = () => {
    const guestCart = getGuestCart();
    const reduxFormattedCart = guestCart.map(convertGuestToReduxFormat);
    dispatch(setCart(reduxFormattedCart));
  };

  // Redux değişikliklerini guest cart'a senkronize et (sadece guest kullanıcılar için)
  useEffect(() => {
    if (isGuest && guestCartLoaded && cart.length >= 0) {
      const guestCart = cart.map(convertReduxToGuestFormat);
      setGuestCart(guestCart);
    }
  }, [cart, isGuest, guestCartLoaded]);

  const totalPrice = useMemo(() => {
    return cart.reduce(
      (total, product) =>
        total + (product.discountedPrice ?? product.price) * product.quantity,
      0
    );
  }, [cart]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Guest kullanıcı uyarısı */}
      {isGuest && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-6">
          <p className="text-yellow-800">
            🔒 Sepetiniz geçici olarak kaydedildi. Siparişi tamamlamak için giriş yapmanız gerekiyor.
            <a href="/login" className="ml-2 text-yellow-600 hover:underline font-medium">
              Giriş Yap
            </a>
          </p>
        </div>
      )}

      {/* Başlık */}
      <div className="flex justify-between items-center border-b border-gray-300 py-4">
        <h1 className="font-bold text-xl sm:text-2xl">
          Alışveriş Listem {isGuest && "(Geçici)"}
        </h1>
        <h1 className="font-medium text-md sm:text-lg">Fiyat</h1>
      </div>

      {/* Ürünler */}
      {cart.length > 0 ? (
        cart.map((product: any) => (
          <CartItem 
            key={product.slug} 
            product={product} 
            dispatch={dispatch}
            isGuest={isGuest}
            onGuestUpdate={handleGuestCartUpdate}
          />
        ))
      ) : (
        <div className="text-center py-10">
          <h1 className="text-gray-500 text-lg sm:text-xl">Sepetiniz boş!</h1>
          <a 
            href="/" 
            className="mt-4 inline-block bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition"
          >
            Alışverişe Başla
          </a>
        </div>
      )}

      {/* Ara Toplam */}
      {cart.length > 0 && (
        <div className="mt-6 text-right">
          <h1 className="text-md sm:text-lg">
            Ara Toplam ({cart.length} ürün):{" "}
            <span className="font-bold text-xl sm:text-2xl">
              {totalPrice.toFixed(2)} TL
            </span>
          </h1>
          
          {/* Checkout Button */}
          <div className="mt-4">
            {isGuest ? (
              <a
                href="/login"
                className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition inline-block"
              >
                Siparişi Tamamlamak İçin Giriş Yap
              </a>
            ) : (
              <button className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition">
                Siparişi Tamamla
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;