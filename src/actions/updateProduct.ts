"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProduct(prevState: any, formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const serial = formData.get("serial") as string;
    const stock = parseInt(formData.get("stock") as string);
    const price = parseFloat(formData.get("price") as string);
    const discount = formData.get("discount") ? parseFloat(formData.get("discount") as string) : null;
    const groupId = formData.get("groupId") as string || null;
    const description = formData.get("description") as string;
    
    // Array değerlerini al
    const brandIds = formData.getAll("brandIds[]") as string[];
    const categoryIds = formData.getAll("categoryIds[]") as string[];
    const mediaIds = formData.getAll("mediaIds[]") as string[];

    // Validation
    if (!name || !id) {
      return "Ürün ID'si ve adı gereklidir.";
    }

    if (stock < 0) {
      return "Stok negatif olamaz.";
    }

    if (price <= 0) {
      return "Fiyat pozitif bir değer olmalıdır.";
    }

    // Database güncellemesi (örnek)
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        serial: serial || null,
        stock,
        price,
        discount,
        groupId,
        description,
        // İlişkisel tablolar için
        brands: {
          set: [], // Önce mevcut ilişkileri temizle
          connect: brandIds.map(id => ({ id })) // Yeni ilişkileri ekle
        },
        categories: {
          set: [], // Önce mevcut ilişkileri temizle
          connect: categoryIds.map(id => ({ id })) // Yeni ilişkileri ekle
        },
        medias: {
          set: [], // Önce mevcut ilişkileri temizle
          connect: mediaIds.map(id => ({ id })) // Yeni ilişkileri ekle
        }
      }
    });

    // Cache'i yenile
    revalidatePath("/admin/products");
    
    // Başarılı güncelleme sonrası yönlendirme
    redirect("/admin/products");
    
  } catch (error) {
    console.error("Ürün güncellenirken hata:", error);
    return "Ürün güncellenirken bir hata oluştu.";
  }
}