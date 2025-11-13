"use server";

import { apiClient } from '@/lib/api-client';
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(prevState: any, formData: FormData) {
  try {
    // -----------------------------
    // 🔹 1. Normal alanlar
    // -----------------------------
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

    // -----------------------------
    // 🔹 2. Çoklu seçim alanları
    // -----------------------------
    const brandIds = formData.getAll("brandIds[]") as string[];
    const categoryIds = formData.getAll("categoryIds[]") as string[];
    const attributeIds = formData.getAll("attributeIds[]") as string[];

    // -----------------------------
    // 🔹 3. Medya ID + Order
    // -----------------------------
    const mediaIds = formData.getAll("mediaIds[]") as string[];
    const mediaOrders = formData.getAll("mediaOrders[]").map(Number);

    // -----------------------------
    // ❗ DİKKAT: NestJS sadece mediaIds + mediaOrders bekliyor
    // -----------------------------

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

      // ✔ NestJS ile %100 uyumlu
      mediaIds,
      mediaOrders,
    };

    console.log("⭐ API’ye gönderilen veri:", productData);

    // -----------------------------
    // 🔹 4. POST isteği
    // -----------------------------
    await apiClient.createProduct(productData);

    // -----------------------------
    // 🔹 5. Revalidate + redirect
    // -----------------------------
    revalidatePath("/administor/add-product");
    redirect("/administor/products");

  } catch (error) {
    console.error("Frontend hatası:", error);
    return "Ürün eklenirken bir hata oluştu.";
  }
}
