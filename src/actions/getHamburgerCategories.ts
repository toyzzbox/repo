"use server";

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

/** Flat list + parent */
export type CategoryFlat = Prisma.CategoryGetPayload<{
  include: { parent: true };
}>;

/** 3 seviye children (parentId: null rootlar) */
export type CategoryTree3 = Prisma.CategoryGetPayload<{
  include: {
    children: {
      include: {
        children: {
          include: {
            children: true;
          };
        };
      };
    };
  };
}>;

/** Single by slug + parent + children */
export type CategoryBySlug = Prisma.CategoryGetPayload<{
  include: { children: true; parent: true };
}>;

export async function getAllCategoriesFlat(): Promise<CategoryFlat[]> {
  try {
    return await prisma.category.findMany({
      include: {
        parent: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  } catch (error) {
    console.error("getAllCategoriesFlat error:", error);
    throw new Error("Kategoriler getirilemedi");
  }
}

/**
 * Tüm kategorileri parent-child hiyerarşisiyle getirir (3 seviye)
 */
export async function getAllCategories(): Promise<CategoryTree3[]> {
  try {
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            children: {
              include: {
                children: true, // 3. seviye
              },
            },
          },
        },
      },
    });

    const desiredOrder = [
      "Oyuncaklar",
      "Anne & Bebek",
      "Spor & Outdoor",
      "Okul & Kırtasiye",
      "Hediyelik",
      "Elektronik",
    ];

    const sorted = categories.sort((a, b) => {
      const indexA = desiredOrder.indexOf(a.name);
      const indexB = desiredOrder.indexOf(b.name);

      if (indexA === -1 && indexB === -1) return a.name.localeCompare(b.name);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;

      return indexA - indexB;
    });

    return sorted;
  } catch (error) {
    console.error("getAllCategories error:", error);
    throw new Error("Kategoriler getirilemedi");
  }
}

/**
 * Belirli bir kategoriyi slug ile getirir
 */
export async function getCategoryBySlug(slug: string): Promise<CategoryBySlug | null> {
  try {
    return await prisma.category.findUnique({
      where: { slug },
      include: {
        children: true,
        parent: true,
      },
    });
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
    return await prisma.category.create({
      data,
    });
  } catch (error) {
    console.error("createCategory error:", error);
    throw new Error("Kategori oluşturulamadı");
  }
}
