"use server";

import { prisma } from "@/lib/prisma";

/**
 * Tüm kategorileri parent-child hiyerarşisiyle getirir
 */
export async function getAllCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        parentId: null, // sadece root kategoriler
      },
      include: {
        children: {
          include: {
            children: true, // 2. seviye alt kategoriler
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return categories;
  } catch (error) {
    console.error("getAllCategories error:", error);
    throw new Error("Kategoriler getirilemedi");
  }
}

/**
 * Belirli bir kategoriyi slug ile getirir
 */
export async function getCategoryBySlug(slug: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        children: true,
        parent: true,
      },
    });

    return category;
  } catch (error) {
    console.error("getCategoryBySlug error:", error);
    throw new Error("Kategori bulunamadı");
  }
}

/**
 * Yeni kategori oluşturur
 */
export async function createCategory(data: {
  name: string;
  slug: string;
  description?: string;
  parentId?: string | null;
}) {
  try {
    const category = await prisma.category.create({
      data,
    });

    return category;
  } catch (error) {
    console.error("createCategory error:", error);
    throw new Error("Kategori oluşturulamadı");
  }
}
