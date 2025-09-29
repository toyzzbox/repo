'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from './auth';
import { getCart } from './cart';

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
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        error: 'Lütfen giriş yapın',
      };
    }

    // Mevcut getCart fonksiyonunu kullan
    const cart = await getCart();

    if (!cart.items || cart.items.length === 0) {
      return {
        success: false,
        error: 'Sepetiniz boş',
      };
    }

    // Kargo maliyetini hesapla
    const shippingCost =
      formData.delivery.method === 'express'
        ? 39.9
        : formData.delivery.method === 'standard'
        ? 19.9
        : 0;

    const total = cart.summary.subtotal + shippingCost;

    // Siparişi oluştur
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total,
        subtotal: cart.summary.subtotal,
        shippingCost,
        status: 'PENDING',
        shippingName: formData.address.name,
        shippingPhone: formData.address.phone,
        shippingAddress: formData.address.address,
        shippingCity: formData.address.city,
        deliveryMethod: formData.delivery.method,
        deliveryDate: formData.delivery.date || new Date().toISOString(),
        paymentMethod: formData.payment.method,
        orderItems: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
            productName: item.product.name,
            // Ürün resmini al - medias array'inden ilk resmi al
            productImage: item.product.medias?.[0]?.media?.urls || null,
          })),
        },
      },
    });

    // Sepeti temizle - Cart modelini kullanarak
    const userCart = await prisma.cart.findFirst({
      where: { userId: user.id, status: 'ACTIVE' },
    });

    if (userCart) {
      // Önce cart items'ı sil
      await prisma.cartItem.deleteMany({
        where: { cartId: userCart.id },
      });
      
      // Sonra cart'ı COMPLETED olarak işaretle (veya sil)
      await prisma.cart.update({
        where: { id: userCart.id },
        data: { status: 'COMPLETED' },
      });
    }

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

// getUserOrders ve getOrderById fonksiyonları aynı kalabilir
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
        userId: user.id,
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