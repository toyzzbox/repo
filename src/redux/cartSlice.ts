// src/redux/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

// Sepet öğesi için bir arayüz tanımlayın
interface CartItem {
  id: string; // Ürün ID'si
  slug: string; // Ürün slug'ı
  name: string; // Ürün adı
  price: number; // Ürün fiyatı
  url?: string; // Ürün görsel URL'si (isteğe bağlı)
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
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingProduct = state.cart.find(item => item.slug === action.payload.slug);
      if (existingProduct) {
        existingProduct.quantity += action.payload.quantity; // Mevcut ürün varsa miktarı artır
      } else {
        state.cart.push({ ...action.payload, quantity: action.payload.quantity }); // Yeni ürün ekle
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
  },
});

// Eylemleri dışa aktar
export const { addToCart, removeFromTheCart, incrementQuantity, decrementQuantity } = cartSlice.actions;

// Sepet durumunu seçen bir seçici (selector) oluşturun
export const getCart = (state: RootState) => state.cart.cart;

// Reducer'ı dışa aktar
export default cartSlice.reducer;
