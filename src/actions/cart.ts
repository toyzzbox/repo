"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 🔥 Sepete ürün ekleme server action
export async function addToCart(userId: string, productId: string, quantity: number = 1) {
  if (!userId) throw new Error("Giriş yapılmamış");

  // Kullanıcının aktif sepetini bul
  let cart = await prisma.cart.findFirst({
    where: { userId, status: "ACTIVE" },
  });

  // Eğer aktif sepet yoksa, yeni oluştur
  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId,
        status: "ACTIVE",
      },
    });
  }

  // Ürün zaten sepette var mı kontrol et → varsa quantity artır
  await prisma.cartItem.upsert({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
    update: {
      quantity: { increment: quantity },
    },
    create: {
      cartId: cart.id,
      productId,
      quantity,
    },
  });

  // Sepet sayfasını güncellemek için revalidate
  revalidatePath("/sepet");
}
