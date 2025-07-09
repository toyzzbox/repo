"use server";

import { prisma } from "@/lib/prisma";



export async function getAllCategoriesFlat() {
    try {
      const categories = await prisma.category.findMany({
        include: {
          parent: true,
        },
        orderBy: {
          name: "asc",
        },
      });
  
      return categories;
    } catch (error) {
      console.error("getAllCategoriesFlat error:", error);
      throw new Error("Kategoriler getirilemedi");
    }
  }
/**
 * Tüm kategorileri parent-child hiyerarşisiyle getirir
 */
export async function getAllCategories() {
    try {
        const categories = await prisma.category.findMany({
            where: {
              parentId: null,
            },
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
      // 🎯 İstenen sıralama
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
  
        if (indexA === -1 && indexB === -1) {
          return a.name.localeCompare(b.name); // listedeyoksa alfabetik
        }
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
