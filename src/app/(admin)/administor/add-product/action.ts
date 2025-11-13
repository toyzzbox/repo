"use server";

import { apiClient } from '@/lib/api-client';
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(prevState: any, formData: FormData) {
  try {
    // 🔹 1) Normal alanlar
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const discount = formData.get("discount")
      ? parseFloat(formData.get("discount") as string)
      : undefined;
    const stock = formData.get("stock")
      ? parseInt(formData.get("stock") as string)
      : undefined;

    const barcode = (formData.get("barcode") as string) || undefined;
    const serial = (formData.get("serial") as string) || undefined;
    const groupId = (formData.get("groupId") as string) || undefined;

    // 🔹 2) Array alanlar
    const brandIds = formData.getAll("brandIds[]") as string[];
    const categoryIds = formData.getAll("categoryIds[]") as string[];
    const attributeIds = formData.getAll("attributeIds[]") as string[];

    // 🔹 3) Medya ID ve Order alanlarını al
    const mediaIds = formData.getAll("mediaIds[]") as string[];
    const mediaOrders = formData.getAll("mediaOrders[]").map(Number);

    // 🔹 4) ID + ORDER array'ini birleştir
    const mediaData = mediaIds.map((id, index) => ({
      id,
      order: mediaOrders[index] ?? index,
    }));

    // 🔹 5) Final Product Data
    const productData = {
      name,
      description,
      price,
      discount,
      stock,
      barcode,
      serial,
      groupId,
      brandIds,
      categoryIds,
      attributeIds,
      mediaData, // ⭐ en önemli kısım
    };

    console.log("⭐ Frontend'den gönderilen veri:", JSON.stringify(productData, null, 2));

    // 🔹 6) NestJS API çağrısı
    await apiClient.createProduct(productData);

    // 🔹 7) Sayfayı yenile ve yönlendir
    revalidatePath("/administor/add-product");
    redirect("/administor/products");

  } catch (error: unknown) {
    console.error("Frontend hatası:", error);

    if (error instanceof Error) {
      return "Ürün eklenirken bir hata oluştu: " + error.message;
    }
    return "Ürün eklenirken bilinmeyen bir hata oluştu";
  }
}
