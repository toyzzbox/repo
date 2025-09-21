"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function getUserFavorites() {
  const session = await getSession();
  if (!session?.user) return [];

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        include: {
          medias: { include: { media: true } },
          brands: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return favorites.map((f) => f.product);
}

export async function removeFavoriteById(productId: string) {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return { success: false, message: 'Oturum açmanız gerekiyor' };
    }

    // Favorinin var olup olmadığını kontrol et
    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        userId: session.user.id,
        productId: productId,
      },
    });

    if (!existingFavorite) {
      return { success: false, message: 'Favori ürün bulunamadı' };
    }

    // Favoriden çıkar
    await prisma.favorite.delete({
      where: {
        id: existingFavorite.id,
      },
    });

    // Cache'i yenile
    revalidatePath('/favorites');
    revalidatePath('/products');

    return { success: true, message: 'Ürün favorilerden çıkarıldı' };
  } catch (error) {
    console.error('Remove favorite error:', error);
    return { success: false, message: 'Bir hata oluştu' };
  }
}

// Bonus: Favori ekleme fonksiyonu (ProductCard'da kullanmak için)
export async function addFavoriteById(productId: string) {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return { success: false, message: 'Oturum açmanız gerekiyor' };
    }

    // Zaten favoride mi kontrol et
    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        userId: session.user.id,
        productId: productId,
      },
    });

    if (existingFavorite) {
      return { success: false, message: 'Ürün zaten favorilerde' };
    }

    // Favoriye ekle
    await prisma.favorite.create({
      data: {
        userId: session.user.id,
        productId: productId,
      },
    });

    // Cache'i yenile
    revalidatePath('/favorites');
    revalidatePath('/products');

    return { success: true, message: 'Ürün favorilere eklendi' };
  } catch (error) {
    console.error('Add favorite error:', error);
    return { success: false, message: 'Bir hata oluştu' };
  }
}

// Kullanıcının favori ürün ID'lerini getir (ProductCard'da kullanmak için)
export async function getUserFavoriteIds() {
  const session = await getSession();
  if (!session?.user) return [];

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    select: { productId: true },
  });

  return favorites.map(f => f.productId);
}