"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Slug oluşturma fonksiyonu
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export const updateProduct = async (
  id: string,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> => {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price");

  const brandIds = formData.getAll("brandIds[]") as string[];
  const categoryIds = formData.getAll("categoryIds[]") as string[];
  const mediaIds = formData.getAll("mediaIds[]") as string[];
  const attributeIds = formData.getAll("attributeIds[]") as string[];

  if (!name) return { error: "Ürün adı gereklidir." };
  if (!price || isNaN(Number(price))) return { error: "Geçerli bir fiyat girin." };

  const slug = slugify(name);

  try {
    await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        price: Number(price),
        brands: {
          set: brandIds.map((id) => ({ id })),
        },
        categories: {
          set: categoryIds.map((id) => ({ id })),
        },
        medias: {
          set: mediaIds.map((id) => ({ id })),
        },
        attributes: {
          set: attributeIds.map((id) => ({ id })),
        },
      },
    });

    revalidatePath("/admin/products");
    revalidatePath(`/product/${slug}`);
    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "Ürün güncellenirken bir hata oluştu." };
  }
};
