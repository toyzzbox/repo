
'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from './auth';


type OrderFormData = {
  address: {
    name: string;
    phone: string;
    address: string;
    city: string;
  };
  delivery: {
    method: string;
    date: string;
  };
  payment: {
    method: string;
  };
};

export async function createOrderAction(formData: OrderFormData) {
  try {
    // Kullanıcıyı al
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        error: 'Lütfen giriş yapın',
      };
    }

    // Sepetteki ürünleri al
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return {
        success: false,
        error: 'Sepetiniz boş',
      };
    }

    // Fiyat hesaplamaları
    const subtotal = cartItems.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    const shippingCost =
      formData.delivery.method === 'express'
        ? 39.9
        : formData.delivery.method === 'standard'
        ? 19.9
        : 0;

    const total = subtotal + shippingCost;

    // Siparişi oluştur
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total,
        subtotal,
        shippingCost,
        status: 'PENDING',

        // Adres bilgileri
        shippingName: formData.address.name,
        shippingPhone: formData.address.phone,
        shippingAddress: formData.address.address,
        shippingCity: formData.address.city,

        // Teslimat bilgileri
        deliveryMethod: formData.delivery.method,
        deliveryDate: formData.delivery.date || new Date().toISOString(),

        // Ödeme bilgileri
        paymentMethod: formData.payment.method,

        // Sipariş kalemleri
        orderItems: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
            productName: item.product.name,
            productImage: item.product.image,
          })),
        },
      },
    });

    // Sepeti temizle
    await prisma.cartItem.deleteMany({
      where: { userId: user.id },
    });

    // Cache'leri yenile
    revalidatePath('/cart');
    revalidatePath('/orders');

    return {
      success: true,
      data: {
        orderId: order.id,
        total: order.total,
      },
    };
  } catch (error) {
    console.error('Create order error:', error);
    return {
      success: false,
      error: 'Sipariş oluşturulurken bir hata oluştu',
    };
  }
}

// Kullanıcının siparişlerini getir
export async function getUserOrders() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        error: 'Lütfen giriş yapın',
      };
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      data: orders,
    };
  } catch (error) {
    console.error('Get user orders error:', error);
    return {
      success: false,
      error: 'Siparişler yüklenirken bir hata oluştu',
    };
  }
}

// Sipariş detayını getir
export async function getOrderById(orderId: string) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        error: 'Lütfen giriş yapın',
      };
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: user.id, // Sadece kendi siparişlerini görebilsin
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return {
        success: false,
        error: 'Sipariş bulunamadı',
      };
    }

    return {
      success: true,
      data: order,
    };
  } catch (error) {
    console.error('Get order by id error:', error);
    return {
      success: false,
      error: 'Sipariş yüklenirken bir hata oluştu',
    };
  }
}