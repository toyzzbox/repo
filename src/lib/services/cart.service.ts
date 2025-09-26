// lib/services/cart.service.ts
import { prisma } from '@/lib/prisma';
import { Cart, CartItem, Product } from '@prisma/client';

export type CartWithItems = Cart & {
  items: (CartItem & { product: Product })[];
};

export class CartService {
  
  // Sepet oluştur veya getir
  static async getOrCreateCart(params: {
    userId?: string;
    sessionId?: string;
  }): Promise<CartWithItems> {
    const { userId, sessionId } = params;

    // Önce mevcut aktif sepeti ara
    let cart = await prisma.cart.findFirst({
      where: {
        OR: [
          userId ? { userId, status: 'ACTIVE' } : {},
          sessionId ? { sessionId, status: 'ACTIVE' } : {},
        ].filter(obj => Object.keys(obj).length > 0),
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Yoksa yeni sepet oluştur
    if (!cart) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + (userId ? 90 : 7)); // Üye: 90 gün, Misafir: 7 gün

      cart = await prisma.cart.create({
        data: {
          userId,
          sessionId,
          expiresAt,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    }

    return cart;
  }

  // Sepete ürün ekle
  static async addItem(params: {
    cartId: string;
    productId: string;
    quantity?: number;
  }) {
    const { cartId, productId, quantity = 1 } = params;

    // Ürünü ve stok durumunu kontrol et
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.isActive) {
      throw new Error('Ürün bulunamadı veya aktif değil');
    }

    if (product.stock < quantity) {
      throw new Error(`Stokta sadece ${product.stock} adet var`);
    }

    // Sepette zaten varsa miktarı güncelle
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      
      if (product.stock < newQuantity) {
        throw new Error(`Maksimum ${product.stock} adet ekleyebilirsiniz`);
      }

      return await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: newQuantity,
          price: product.price, // Güncel fiyatı kaydet
        },
        include: {
          product: true,
        },
      });
    }

    // Yeni ürün ekle
    return await prisma.cartItem.create({
      data: {
        cartId,
        productId,
        quantity,
        price: product.price,
      },
      include: {
        product: true,
      },
    });
  }

  // Sepet ürününü güncelle
  static async updateItemQuantity(params: {
    itemId: string;
    quantity: number;
  }) {
    const { itemId, quantity } = params;

    if (quantity < 1) {
      return await this.removeItem(itemId);
    }

    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { product: true },
    });

    if (!item) {
      throw new Error('Sepet ürünü bulunamadı');
    }

    if (item.product.stock < quantity) {
      throw new Error(`Stokta sadece ${item.product.stock} adet var`);
    }

    return await prisma.cartItem.update({
      where: { id: itemId },
      data: {
        quantity,
        price: item.product.price, // Fiyatı güncelle
      },
      include: {
        product: true,
      },
    });
  }

  // Sepetten ürün sil
  static async removeItem(itemId: string) {
    return await prisma.cartItem.delete({
      where: { id: itemId },
    });
  }

  // Sepeti temizle
  static async clearCart(cartId: string) {
    return await prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }

  // Misafir sepetini üye sepetine birleştir
  static async mergeCarts(params: {
    guestSessionId: string;
    userId: string;
  }) {
    const { guestSessionId, userId } = params;

    // Misafir sepetini bul
    const guestCart = await prisma.cart.findFirst({
      where: {
        sessionId: guestSessionId,
        status: 'ACTIVE',
      },
      include: {
        items: true,
      },
    });

    if (!guestCart || guestCart.items.length === 0) {
      return null;
    }

    // Üye sepetini bul veya oluştur
    let userCart = await prisma.cart.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
      },
      include: {
        items: true,
      },
    });

    if (!userCart) {
      // Misafir sepetini üye sepetine çevir
      return await prisma.cart.update({
        where: { id: guestCart.id },
        data: {
          userId,
          sessionId: null,
          status: 'ACTIVE',
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    }

    // Her iki sepette de ürünler varsa birleştir
    for (const guestItem of guestCart.items) {
      const existingItem = userCart.items.find(
        item => item.productId === guestItem.productId
      );

      if (existingItem) {
        // Miktarları topla
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: existingItem.quantity + guestItem.quantity,
          },
        });
      } else {
        // Yeni ürün ekle
        await prisma.cartItem.create({
          data: {
            cartId: userCart.id,
            productId: guestItem.productId,
            quantity: guestItem.quantity,
            price: guestItem.price,
          },
        });
      }
    }

    // Misafir sepetini MERGED olarak işaretle
    await prisma.cart.update({
      where: { id: guestCart.id },
      data: { status: 'MERGED' },
    });

    // Güncel sepeti döndür
    return await prisma.cart.findUnique({
      where: { id: userCart.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  // Sepet özetini hesapla
  static calculateCartSummary(cart: CartWithItems) {
    const subtotal = cart.items.reduce((sum, item) => {
      return sum + Number(item.price) * item.quantity;
    }, 0);

    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    // Kargo hesaplama (basit örnek)
    const shippingCost = subtotal >= 500 ? 0 : 29.99;
    const freeShippingThreshold = 500;
    const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

    const total = subtotal + shippingCost;

    return {
      subtotal,
      shippingCost,
      total,
      itemCount,
      freeShippingThreshold,
      remainingForFreeShipping,
    };
  }

  // Sepeti siparişe çevir
  static async convertToOrder(cartId: string, userId: string) {
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new Error('Sepet boş veya bulunamadı');
    }

    const summary = this.calculateCartSummary(cart);

    // Transaction ile sipariş oluştur
    return await prisma.$transaction(async (tx) => {
      // Sipariş numarası oluştur
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Sipariş oluştur
      const order = await tx.order.create({
        data: {
          userId,
          orderNumber,
          totalAmount: summary.total,
          shippingCost: summary.shippingCost,
          items: {
            create: cart.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      // Stokları düş
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Sepeti CONVERTED olarak işaretle
      await tx.cart.update({
        where: { id: cartId },
        data: { status: 'CONVERTED' },
      });

      return order;
    });
  }

  // Süresi dolmuş sepetleri temizle (CRON job için)
  static async cleanExpiredCarts() {
    const now = new Date();
    
    return await prisma.cart.updateMany({
      where: {
        expiresAt: {
          lte: now,
        },
        status: 'ACTIVE',
      },
      data: {
        status: 'EXPIRED',
      },
    });
  }
}