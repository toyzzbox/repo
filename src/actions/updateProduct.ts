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
    const discount = formData.get("discount")
      ? parseFloat(formData.get("discount") as string)
      : null;
    const groupId = formData.get("groupId") || null;
    const description = formData.get("description") as string;
    const barcode = formData.get("barcode") as string;
    const brandIds = formData.getAll("brandIds[]") as string[];
    const categoryIds = formData.getAll("categoryIds[]") as string[];
    const mediaIds = formData.getAll("mediaIds[]") as string[];

    // Validation
    if (!name || !id) return "Ürün ID'si ve adı gereklidir.";
    if (stock < 0) return "Stok negatif olamaz.";
    if (price <= 0) return "Fiyat pozitif olmalıdır.";

    // 1. Ürün temel bilgilerini güncelle
    await prisma.product.update({
      where: { id },
      data: {
        name,
        serial: serial || null,
        stock,
        price,
        discount,
        groupId: groupId || null,
        description,
        barcode,
        brands: {
          set: [],
          connect: brandIds.map((bid) => ({ id: bid })),
        },
        categories: {
          set: [],
          connect: categoryIds.map((cid) => ({ id: cid })),
        },
      },
    });

    // 2. Eski medya ilişkilerini temizle
    await prisma.productMedia.deleteMany({
      where: { productId: id },
    });

    // 3. Yeni medya ilişkilerini sıraya göre oluştur
    const mediaConnections = mediaIds.map((mediaId, index) => ({
      productId: id,
      mediaId,
      order: index,
    }));

    await prisma.productMedia.createMany({
      data: mediaConnections,
    });

    // 4. Cache ve yönlendirme
    revalidatePath("/admin/products");
    redirect("/admin/products");

  } catch (error) {
    console.error("Ürün güncellenirken hata:", error);
    return "Ürün güncellenirken bir hata oluştu.";
  }
}
