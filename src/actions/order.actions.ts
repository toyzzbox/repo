"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "./auth";
import { sendEmail } from "@/lib/mailer";
import { VariantType } from "@prisma/client";

interface FormAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  district?: string;
  postalCode?: string;
}

interface FormDelivery {
  method: string;
  date?: string;
}

interface FormPayment {
  method: string;
}

interface CreateOrderInput {
  address: FormAddress;
  delivery: FormDelivery;
  payment: FormPayment;
}

interface ActionResponse {
  success: boolean;
  data?: { orderId: string };
  error?: string;
}

export async function createOrderAction(input: CreateOrderInput): Promise<ActionResponse> {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return { success: false, error: "Sipariş vermek için giriş yapmalısınız" };
    }

    // ✅ Aktif sepeti al (product medyalarını yeni yapıya göre include ediyoruz)
    const cart = await prisma.cart.findFirst({
      where: { userId: user.id, status: "ACTIVE" },
      include: {
        items: {
          include: {
            product: {
              include: {
                medias: {
                  orderBy: { order: "asc" },
                  include: {
                    media: {
                      select: {
                        id: true,
                        variants: {
                          where: { type: VariantType.ORIGINAL }, // istersen WEBP
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
      },
    });

    if (!cart || cart.items.length === 0) {
      return { success: false, error: "Sepetiniz boş" };
    }

    // Var olan adresi kontrol et
    let addressRefId: string | null = null;
    const existingAddress = await prisma.address.findFirst({
      where: {
        userId: user.id,
        fullName: input.address.name,
        addressLine: input.address.address,
      },
    });

    if (existingAddress) addressRefId = existingAddress.id;

    // Sepet toplamları
    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingCost = input.delivery.method === "express" ? 39.9 : 19.9;
    const total = subtotal + shippingCost;

    // Siparişi oluştur
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        subtotal,
        shippingCost,
        total,
        status: "PENDING",
        addressId: addressRefId,
        shippingName: input.address.name,
        shippingPhone: input.address.phone,
        shippingAddress: input.address.address,
        shippingCity: input.address.city,
        shippingDistrict: input.address.district ?? "",
        shippingPostalCode: input.address.postalCode ?? "",
        deliveryMethod: input.delivery.method,
        deliveryDate: input.delivery.date ? new Date(input.delivery.date) : null,
        paymentMethod: input.payment.method,

        orderItems: {
          create: cart.items.map((item) => {
            const image =
              item.product?.medias?.[0]?.media?.variants?.[0]?.cdnUrl ?? null;

            return {
              productId: item.productId,
              productName: item.product?.name ?? "Bilinmeyen Ürün",
              productImage: image,
              quantity: item.quantity,
              price: item.price,
            };
          }),
        },
      },
    });

    // Müşteriye mail gönder
    try {
      await sendEmail(
        user.email,
        "Siparişiniz Alındı",
        `<h1>Merhaba ${input.address.name}</h1>
         <p>Siparişiniz başarıyla alındı.</p>
         <p>Sipariş numaranız: <b>${order.id}</b></p>
         <p>Toplam: ${order.total.toFixed(2)} TL</p>`
      );
    } catch (mailError) {
      console.error("Mail gönderilemedi:", mailError);
    }

    // Sepeti CHECKEDOUT yap
    await prisma.cart.update({
      where: { id: cart.id },
      data: { status: "CHECKEDOUT" },
    });

    return { success: true, data: { orderId: order.id } };
  } catch (error: any) {
    console.error("createOrderAction error:", error);
    return { success: false, error: error.message || "Bilinmeyen bir hata oluştu" };
  }
}
