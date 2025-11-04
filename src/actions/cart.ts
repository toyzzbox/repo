"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { getCurrentUser } from "./auth";

// ✅ Types
type MediaVariant = {
  cdnUrl: string;
  key: string;
  format?: string | null;
};

type CartItem = {
  id: string;
  quantity: number;
  price: number;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    stock: number | null;
    medias: Array<{
      media: {
        variants: MediaVariant[];
      };
    }>;
  };
};

type CartSummary = {
  subtotal: number;
  shippingCost: number;
  total: number;
  itemCount: number;
  freeShippingThreshold: number;
  remainingForFreeShipping: number;
};

type CartState = {
  items: CartItem[];
  summary: CartSummary;
};

type CartWithItems = {
  id: string;
  userId: string | null;
  sessionId: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  items: CartItem[];
};

// ✅ Helper: Session ID'yi al veya oluştur
async function getOrCreateSessionId(): Promise<string> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get("cart_session_id")?.value;

  if (!sessionId) {
    sessionId = randomUUID();
    cookieStore.set("cart_session_id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 gün
    });
  }

  return sessionId;
}

// ✅ Helper: Aktif sepeti bul veya oluştur
async function getOrCreateCart(): Promise<{ id: string; userId: string | null; sessionId: string | null }> {
  const user = await getCurrentUser();

  if (user) {
    let cart = await prisma.cart.findFirst({
      where: { userId: user.id, status: "ACTIVE" },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: user.id,
          status: "ACTIVE",
        },
      });
    }

    return cart;
  } else {
    const sessionId = await getOrCreateSessionId();

    let cart = await prisma.cart.findFirst({
      where: { sessionId, status: "ACTIVE" },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          sessionId,
          status: "ACTIVE",
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
    }

    return cart;
  }
}

// ✅ Helper: Sepet özetini hesapla
function calculateSummary(items: CartItem[]): CartSummary {
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const freeShippingThreshold = 500;
  const shippingCost = subtotal >= freeShippingThreshold ? 0 : 50;
  const total = subtotal + shippingCost;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return {
    subtotal,
    shippingCost,
    total,
    itemCount,
    freeShippingThreshold,
    remainingForFreeShipping,
  };
}

// ✅ Sepete ürün ekleme
export async function addToCart(productId: string, quantity: number = 1) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, price: true, stock: true, name: true },
    });

    if (!product) throw new Error("Ürün bulunamadı");

    if (product.stock !== null && quantity > product.stock) {
      throw new Error("Yetersiz stok");
    }

    const cart = await getOrCreateCart();

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (product.stock !== null && newQuantity > product.stock) {
        throw new Error("Stok miktarını aştınız");
      }

      await prisma.cartItem.update({
        where: { cartId_productId: { cartId: cart.id, productId } },
        data: { quantity: newQuantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          price: product.price,
        },
      });
    }

    revalidatePath("/sepet");
    revalidatePath("/");

    return { success: true, message: "Ürün sepete eklendi" };
  } catch (error: any) {
    console.error("Add to cart error:", error);
    return { success: false, error: error.message };
  }
}

// ✅ Sepet öğesi miktarını güncelleme
export async function updateCartItemQuantity(itemId: string, quantity: number) {
  try {
    if (quantity < 1) throw new Error("Miktar 1'den az olamaz");

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { product: { select: { stock: true, name: true } } },
    });

    if (!cartItem) throw new Error("Sepet öğesi bulunamadı");

    if (cartItem.product.stock !== null && quantity > cartItem.product.stock) {
      throw new Error(`${cartItem.product.name} için maksimum ${cartItem.product.stock} adet ekleyebilirsiniz`);
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    revalidatePath("/sepet");

    return { success: true, message: "Miktar güncellendi" };
  } catch (error: any) {
    console.error("Update cart item error:", error);
    return { success: false, error: error.message };
  }
}

// ✅ Sepetten ürün kaldırma
export async function removeFromCart(itemId: string) {
  try {
    await prisma.cartItem.delete({ where: { id: itemId } });
    revalidatePath("/sepet");
    return { success: true, message: "Ürün sepetten kaldırıldı" };
  } catch (error: any) {
    console.error("Remove from cart error:", error);
    return { success: false, error: error.message };
  }
}

// ✅ Sepeti temizleme
export async function clearCart() {
  try {
    const cart = await getOrCreateCart();
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    revalidatePath("/sepet");
    return { success: true, message: "Sepet temizlendi" };
  } catch (error: any) {
    console.error("Clear cart error:", error);
    return { success: false, error: error.message };
  }
}

// ✅ Sepeti getirme - CartState formatında
export async function getCart(): Promise<CartState> {
  try {
    const user = await getCurrentUser();
    let cart;

    const baseInclude = {
      items: {
        include: {
          product: {
            include: {
              medias: {
                include: {
                  media: {
                    include: {
                      variants: {
                        select: {
                          cdnUrl: true,
                          key: true,
                          format: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    };

    if (user) {
      cart = await prisma.cart.findFirst({
        where: { userId: user.id, status: "ACTIVE" },
        include: baseInclude,
      });
    } else {
      const cookieStore = await cookies();
      const sessionId = cookieStore.get("cart_session_id")?.value;
      if (sessionId) {
        cart = await prisma.cart.findFirst({
          where: { sessionId, status: "ACTIVE" },
          include: baseInclude,
        });
      }
    }

    if (!cart || !cart.items.length) {
      return {
        items: [],
        summary: {
          subtotal: 0,
          shippingCost: 0,
          total: 0,
          itemCount: 0,
          freeShippingThreshold: 500,
          remainingForFreeShipping: 500,
        },
      };
    }

    return {
      items: cart.items,
      summary: calculateSummary(cart.items),
    };
  } catch (error) {
    console.error("Get cart error:", error);
    return {
      items: [],
      summary: {
        subtotal: 0,
        shippingCost: 0,
        total: 0,
        itemCount: 0,
        freeShippingThreshold: 500,
        remainingForFreeShipping: 500,
      },
    };
  }
}

// ✅ Sepet sayısını getirme
export async function getCartCount(): Promise<number> {
  try {
    const cartState = await getCart();
    return cartState.summary.itemCount;
  } catch (error) {
    console.error("Get cart count error:", error);
    return 0;
  }
}

// ✅ Kullanıcı girişi yaptığında misafir sepetini birleştirme
export async function mergeGuestCartToUser(userId: string) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("cart_session_id")?.value;

    if (!sessionId) return;

    const guestCart = await prisma.cart.findFirst({
      where: { sessionId, status: "ACTIVE" },
      include: { items: true },
    });

    if (!guestCart || guestCart.items.length === 0) return;

    let userCart = await prisma.cart.findFirst({
      where: { userId, status: "ACTIVE" },
    });

    if (!userCart) {
      userCart = await prisma.cart.create({
        data: { userId, status: "ACTIVE" },
      });
    }

    for (const item of guestCart.items) {
      await prisma.cartItem.upsert({
        where: {
          cartId_productId: {
            cartId: userCart.id,
            productId: item.productId,
          },
        },
        update: {
          quantity: { increment: item.quantity },
        },
        create: {
          cartId: userCart.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        },
      });
    }

    await prisma.cart.delete({ where: { id: guestCart.id } });
    cookieStore.delete("cart_session_id");
    revalidatePath("/sepet");
  } catch (error) {
    console.error("Merge guest cart error:", error);
  }
}
