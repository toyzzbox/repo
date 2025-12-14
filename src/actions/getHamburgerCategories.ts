"use server";

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

/**
 * Hamburger menüde kullanılacak minimum kategori tipi
 * (Prisma payload tiplerinden türetiliyor)
 */
export type HamburgerCategory = Prisma.CategoryGetPayload<{
  include: {
    children: {
      include: {
        children: {
          include: {
            children: true; // 3. seviye
          };
        };
      };
    };
  };
}>;

/**
 * Flat liste için parent dahil
 */
export type HamburgerCategoryFlat = Prisma.CategoryGetPayload<{
  include: { parent: true };
}>;

/**
 * Hamburger: Root kategorileri (parentId: null) 3 seviye children ile getirir
 */
export async function getHamburgerCategories(): Promise<HamburgerCategory[]> {
  try {
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            children: {
              include: {
                children: true,
              },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return categories;
  } catch (error) {
    console.error("getHamburgerCategories error:", error);
    throw new Error("Hamburger kategorileri getirilemedi");
  }
}

/**
 * Hamburger: Tüm kategorileri flat şekilde (parent dahil) getirir
 */
export async function getHamburgerCategoriesFlat(): Promise<HamburgerCategoryFlat[]> {
  try {
    return await prisma.category.findMany({
      include: { parent: true },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("getHamburgerCategoriesFlat error:", error);
    throw new Error("Kategoriler getirilemedi");
  }
}

/**
 * Slug ile tek kategori + parent + children
 */
export type HamburgerCategoryBySlug = Prisma.CategoryGetPayload<{
  include: { parent: true; children: true };
}>;

export async function getHamburgerCategoryBySlug(
  slug: string
): Promise<HamburgerCategoryBySlug | null> {
  try {
    return await prisma.category.findUnique({
      where: { slug },
      include: { parent: true, children: true },
    });
  } catch (error) {
    console.error("getHamburgerCategoryBySlug error:", error);
    throw new Error("Kategori bulunamadı");
  }
}

/**
 * ✅ Kategori oluşturma (parentId null problemi burada çözülüyor)
 * - parentId varsa: parent.connect
 * - parentId yoksa/null ise: parent alanı hiç gönderilmez (root kategori)
 */
type CreateCategoryInput = {
  name: string;
  slug: string;
  description?: string;
  parentId?: string | null;
};

export async function createCategory(input: CreateCategoryInput) {
  try {
    const { parentId, ...rest } = input;

    return await prisma.category.create({
      data: {
        ...rest,
        ...(parentId ? { parent: { connect: { id: parentId } } } : {}),
      },
    });
  } catch (error) {
    console.error("createCategory error:", error);
    throw new Error("Kategori oluşturulamadı");
  }
}

/**
 * Parent değiştirme (opsiyonel ama çok lazım oluyor)
 * - parentId verirse connect
 * - parentId null/undefined ise disconnect
 */
export async function updateCategoryParent(categoryId: string, parentId?: string | null) {
  try {
    return await prisma.category.update({
      where: { id: categoryId },
      data: {
        ...(parentId
          ? { parent: { connect: { id: parentId } } }
          : { parent: { disconnect: true } }),
      },
    });
  } catch (error) {
    console.error("updateCategoryParent error:", error);
    throw new Error("Kategori parent güncellenemedi");
  }
}
