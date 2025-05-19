"use server";

import { prisma } from "@/lib/prisma";


// CreateCategoryArgs tipini tanımlama
type CreateCategoryArgs = {
  name: string;
  slug: string;
  description: string;
  parentId: string | null; // parentId null olabilir
}

// createCategory fonksiyonu
export async function createCategory(previousState: any, formData: FormData) {
  try {
    // FormData'dan değerleri al
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const parentId = formData.get("parentId") as string | null; // parentId null olabilir
 
  
    // Kategori oluşturma
    await prisma.category.create({
      data: {
        slug,
        name,
        description,
        parentId: parentId || null, // If parentId is null, pass null

      },
    });

    return "Kategori başarıyla oluşturuldu.";
  } catch (error) {
    console.error("Error creating category:", error);
    return "Kategori oluşturma sırasında bir hata oluştu.";
  }
}
