"use server";

import { prisma } from "@/lib/prisma";

export async function getOrderById(orderId: string) {
  if (!orderId) {
    console.error("❌ getOrderById: orderId is undefined");
    return null;
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                medias: {
                  include: {
                    media: true,
                  },
                },
              },
            },
          },
        },
        address: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) return null;

    // front-end ile uyumlu hale getirme
    return {
      id: order.id,
      createdAt: order.createdAt,
      status: order.status,
      subtotal: order.subtotal,
      total: order.total,
      shippingCost: order.shippingCost,
      paymentMethod: order.paymentMethod,
      shippingName: order.shippingName,
      shippingPhone: order.shippingPhone,
      shippingAddress: order.shippingAddress,
      shippingCity: order.shippingCity,
      shippingDistrict: order.shippingDistrict,
      shippingPostalCode: order.shippingPostalCode,
      deliveryMethod: order.deliveryMethod,
      deliveryDate: order.deliveryDate,
      user: order.user,
      address: order.address ?? null,
      // orderItems → items olarak rename
      items:
        order.orderItems.map((item) => ({
          id: item.id,
          title: item.product?.name ?? "Bilinmeyen Ürün",
          sku: item.product?.sku ?? "",
          qty: item.quantity,
          price: item.price,
          image: item.product?.medias?.[0]?.media?.urls?.[0] ?? null,
        })) ?? [],
    };
  } catch (error) {
    console.error("🔥 getOrderById error:", error);
    return null;
  }
}
