// app/actions/cart.actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';
import { CartService } from '@/lib/services/cart.service';
import { getCurrentUser } from './auth';

// Response type'ları
type ActionResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Session ID al veya oluştur (helper)
 */
async function getOrCreateSessionId(): Promise<string> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get('cart_session_id')?.value;
  
  if (!sessionId) {
    sessionId = randomUUID();
    cookieStore.set('cart_session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 gün
    });
  }
  
  return sessionId;
}

/**
 * Kullanıcı bilgilerini al (helper)
 */
async function getUserInfo() {
  const user = await getCurrentUser(); // 🔥 KENDİ AUTH FONKSİYONUNUZ
  const sessionId = await getOrCreateSessionId();
  
  return {
    userId: user?.id,
    sessionId: !user ? sessionId : undefined,
    isAuthenticated: !!user,
  };
}

/**
 * Sepeti getir veya oluştur
 */
export async function getCartAction(): Promise<ActionResponse> {
  try {
    const { userId, sessionId } = await getUserInfo();

    const cart = await CartService.getOrCreateCart({
      userId,
      sessionId,
    });

    const summary = CartService.calculateCartSummary(cart);

    return {
      success: true,
      data: { cart, summary },
    };
  } catch (error) {
    console.error('Get cart error:', error);
    return {
      success: false,
      error: 'Sepet yüklenemedi',
    };
  }
}

/**
 * Sepete ürün ekle
 */
export async function addToCartAction(
  productId: string,
  quantity: number = 1
): Promise<ActionResponse> {
  try {
    const { userId, sessionId } = await getUserInfo();

    // Önce sepeti al veya oluştur
    const cart = await CartService.getOrCreateCart({
      userId,
      sessionId,
    });

    // Ürünü ekle
    const item = await CartService.addItem({
      cartId: cart.id,
      productId,
      quantity,
    });

    // Güncel sepeti ve özeti getir
    const updatedCart = await CartService.getOrCreateCart({
      userId,
      sessionId,
    });
    const summary = CartService.calculateCartSummary(updatedCart);

    // İlgili sayfaları yenile
    revalidatePath('/cart');
    revalidatePath('/');

    return {
      success: true,
      data: { 
        item, 
        cart: updatedCart, 
        summary 
      },
    };
  } catch (error: any) {
    console.error('Add to cart error:', error);
    return {
      success: false,
      error: error.message || 'Ürün sepete eklenemedi',
    };
  }
}

/**
 * Sepet ürününün miktarını güncelle
 */
export async function updateCartItemAction(
  itemId: string,
  quantity: number
): Promise<ActionResponse> {
  try {
    if (quantity < 0) {
      return {
        success: false,
        error: 'Geçersiz miktar',
      };
    }

    await CartService.updateItemQuantity({
      itemId,
      quantity,
    });

    // Güncel sepeti getir
    const { userId, sessionId } = await getUserInfo();
    const cart = await CartService.getOrCreateCart({
      userId,
      sessionId,
    });
    const summary = CartService.calculateCartSummary(cart);

    revalidatePath('/cart');

    return {
      success: true,
      data: { cart, summary },
    };
  } catch (error: any) {
    console.error('Update cart item error:', error);
    return {
      success: false,
      error: error.message || 'Miktar güncellenemedi',
    };
  }
}

/**
 * Sepetten ürün sil
 */
export async function removeCartItemAction(
  itemId: string
): Promise<ActionResponse> {
  try {
    await CartService.removeItem(itemId);

    // Güncel sepeti getir
    const { userId, sessionId } = await getUserInfo();
    const cart = await CartService.getOrCreateCart({
      userId,
      sessionId,
    });
    const summary = CartService.calculateCartSummary(cart);

    revalidatePath('/cart');

    return {
      success: true,
      data: { cart, summary },
    };
  } catch (error: any) {
    console.error('Remove cart item error:', error);
    return {
      success: false,
      error: error.message || 'Ürün silinemedi',
    };
  }
}

/**
 * Sepeti temizle
 */
export async function clearCartAction(): Promise<ActionResponse> {
  try {
    const { userId, sessionId } = await getUserInfo();

    const cart = await CartService.getOrCreateCart({
      userId,
      sessionId,
    });

    await CartService.clearCart(cart.id);

    revalidatePath('/cart');

    return {
      success: true,
      data: { message: 'Sepet temizlendi' },
    };
  } catch (error: any) {
    console.error('Clear cart error:', error);
    return {
      success: false,
      error: 'Sepet temizlenemedi',
    };
  }
}

/**
 * Misafir sepetini üye sepetine birleştir (Login sonrası)
 */
export async function mergeCartsAction(): Promise<ActionResponse> {
  try {
    const user = await getCurrentUser(); // 🔥 KENDİ AUTH FONKSİYONUNUZ
    
    if (!user?.id) {
      return {
        success: false,
        error: 'Giriş yapmalısınız',
      };
    }

    const cookieStore = await cookies();
    const guestSessionId = cookieStore.get('cart_session_id')?.value;

    if (!guestSessionId) {
      // Zaten birleştirilmiş veya misafir sepeti yok
      return {
        success: true,
        data: { message: 'Birleştirilecek sepet bulunamadı' },
      };
    }

    const mergedCart = await CartService.mergeCarts({
      guestSessionId,
      userId: user.id,
    });

    // Cookie'yi temizle
    cookieStore.delete('cart_session_id');

    revalidatePath('/cart');
    revalidatePath('/');

    return {
      success: true,
      data: { 
        cart: mergedCart,
        message: 'Sepetler birleştirildi' 
      },
    };
  } catch (error: any) {
    console.error('Merge carts error:', error);
    return {
      success: false,
      error: error.message || 'Sepetler birleştirilemedi',
    };
  }
}

/**
 * Sepeti siparişe çevir (Checkout)
 */
export async function checkoutAction(
  shippingAddressId?: string
): Promise<ActionResponse> {
  try {
    const user = await getCurrentUser(); // 🔥 KENDİ AUTH FONKSİYONUNUZ
    
    if (!user?.id) {
      return {
        success: false,
        error: 'Sipariş vermek için giriş yapmalısınız',
      };
    }

    const { userId, sessionId } = await getUserInfo();

    // Sepeti getir
    const cart = await CartService.getOrCreateCart({
      userId,
      sessionId,
    });

    if (!cart.items.length) {
      return {
        success: false,
        error: 'Sepetiniz boş',
      };
    }

    // Siparişe çevir
    const order = await CartService.convertToOrder(
      cart.id,
      user.id
    );

    revalidatePath('/orders');
    revalidatePath('/cart');

    return {
      success: true,
      data: { 
        order,
        message: 'Siparişiniz oluşturuldu' 
      },
    };
  } catch (error: any) {
    console.error('Checkout error:', error);
    return {
      success: false,
      error: error.message || 'Sipariş oluşturulamadı',
    };
  }
}

/**
 * Sepet sayısını getir (Badge için)
 */
export async function getCartCountAction(): Promise<number> {
  try {
    const { userId, sessionId } = await getUserInfo();

    const cart = await CartService.getOrCreateCart({
      userId,
      sessionId,
    });

    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  } catch (error) {
    console.error('Get cart count error:', error);
    return 0;
  }
}