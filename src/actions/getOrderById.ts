"use server";

import { prisma } from "@/lib/prisma";

export async function getOrderById(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              include: {
                medias: {
                  include: { media: true },
                },
              },
            },
          },
        },
        shippingAddress: true,
      },
    });

    if (!order) return null;

    return {
      id: order.id,
      createdAt: order.createdAt.toISOString(),
      status: order.status,
      total: order.total,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      paymentMethod: order.paymentMethod ?? "Bilinmiyor",
      trackingUrl: order.trackingUrl ?? null,
      shippingAddress: {
        name: order.shippingAddress?.name ?? "",
        phone: order.shippingAddress?.phone ?? "",
        line1: order.shippingAddress?.line1 ?? "",
        line2: order.shippingAddress?.line2 ?? "",
        city: order.shippingAddress?.city ?? "",
        zip: order.shippingAddress?.zip ?? "",
        country: order.shippingAddress?.country ?? "",
      },
      items: order.items.map((item) => ({
        id: item.id,
        title: item.product?.name ?? "Bilinmeyen Ürün",
        sku: item.product?.barcode ?? "",
        qty: item.quantity,
        price: item.price,
        image: item.product?.medias?.[0]?.media?.urls?.[0] ?? null,
      })),
    };
  } catch (error) {
    console.error("getOrderById error:", error);
    return null;
  }
}
