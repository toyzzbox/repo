// src/redux/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

// Medya yapısı için interface
interface Media {
  media: {
    urls: string[];
  };
}

// Sepet öğesi için bir arayüz tanımlayın
interface CartItem {
  id: string; // Ürün ID'si
  slug: string; // Ürün slug'ı
  name: string; // Ürün adı
  price: number; // Ürün fiyatı
  discountedPrice?: number;
  medias?: Media[]; // Medias array'i
  url?: string; // Fallback URL
  image?: string; // ✅ Ana resim URL'si - addToCart'da kullanıyorsunuz
  quantity: number; // Ürün miktarı
}

// Sepet durumu için bir arayüz tanımlayın
interface CartState {
  cart: CartItem[]; // Sepet öğeleri dizisi
}

// Başlangıç durumu
const initialState: CartState = {
  cart: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<any>) => { // ✅ Product objesinin tamamını kabul et
      const existingProduct = state.cart.find(item => item.slug === action.payload.slug);
      if (existingProduct) {
        existingProduct.quantity += action.payload.quantity || 1; // Mevcut ürün varsa miktarı artır
      } else {
        // ✅ Tam product objesini kopyalayarak ekle
        state.cart.push({
          ...action.payload,
          quantity: action.payload.quantity || 1
        });
      }
    },
    removeFromTheCart: (state, action: PayloadAction<string>) => {
      state.cart = state.cart.filter(item => item.slug !== action.payload); // Ürünü kaldır
    },
    incrementQuantity: (state, action: PayloadAction<{ slug: string }>) => {
      const existingProduct = state.cart.find(item => item.slug === action.payload.slug);
      if (existingProduct) {
        existingProduct.quantity += 1; // Miktarı artır
      }
    },
    decrementQuantity: (state, action: PayloadAction<{ slug: string }>) => {
      const existingProduct = state.cart.find(item => item.slug === action.payload.slug);
      if (existingProduct && existingProduct.quantity > 1) {
        existingProduct.quantity -= 1; // Miktarı azalt (1'den az olmamalı)
      }
    },
    // ✅ Guest cart için eklenen yeni action
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.cart = action.payload; // Tüm sepeti değiştir
    },
    // ✅ Sepeti temizleme action'ı (isteğe bağlı)
    clearCart: (state) => {
      state.cart = [];
    },
  },
});

// Eylemleri dışa aktar
export const { 
  addToCart, 
  removeFromTheCart, 
  incrementQuantity, 
  decrementQuantity,
  setCart, // ✅ Yeni action
  clearCart // ✅ Yeni action
} = cartSlice.actions;

// Sepet durumunu seçen bir seçici (selector) oluşturun
export const getCart = (state: RootState) => state.cart.cart;

// Sepet toplam fiyatını hesaplayan selector (isteğe bağlı)
export const getCartTotal = (state: RootState) => 
  state.cart.cart.reduce((total, item) => 
    total + (item.discountedPrice ?? item.price) * item.quantity, 0
  );

// Sepet item sayısını dönen selector (isteğe bağlı)
export const getCartItemCount = (state: RootState) => 
  state.cart.cart.reduce((total, item) => total + item.quantity, 0);

// Reducer'ı dışa aktar
export default cartSlice.reducer;