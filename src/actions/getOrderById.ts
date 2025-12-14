"use server";

import { prisma } from "@/lib/prisma";
import { VariantType } from "@prisma/client";

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
                    media: {
                      include: {
                        variants: {
                          where: { type: VariantType.ORIGINAL }, // istersen WEBP yap
                          select: { cdnUrl: true, key: true, type: true },
                          take: 1,
                        },
                      },
                    },
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

      items: order.orderItems.map((item) => {
        const firstMedia = item.product?.medias?.[0]?.media;
        const image =
          firstMedia?.variants?.[0]?.cdnUrl ?? null;

        return {
          id: item.id,
          title: item.product?.name ?? "Bilinmeyen Ürün",
          sku: item.product?.sku ?? "",
          qty: item.quantity,
          price: item.price,
          image,
        };
      }),
    };
  } catch (error) {
    console.error("🔥 getOrderById error:", error);
    return null;
  }
}
