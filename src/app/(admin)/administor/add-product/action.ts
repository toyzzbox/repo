"use server";

import { apiClient } from "@/lib/api-client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(prevState: any, formData: FormData) {
  try {
    // -------------------------------------
    // 1) Basit alanlar
    // -------------------------------------
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

    // -------------------------------------
    // 2) Multi-select alanlar
    // -------------------------------------
    const brandIds = formData.getAll("brandIds[]") as string[];
    const categoryIds = formData.getAll("categoryIds[]") as string[];
    const attributeIds = formData.getAll("attributeIds[]") as string[];

    // -------------------------------------
    // 3) Medya alanları (ID + Order)
    // -------------------------------------
    const mediaIds = formData.getAll("mediaIds[]") as string[];
    const mediaOrders = formData.getAll("mediaOrders[]").map((v) => Number(v));

    // -------------------------------------
    // 4) NestJS API'nin beklediği JSON
    // -------------------------------------
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

      // ⭐ NestJS ile birebir uyumlu payload
      mediaIds,
      mediaOrders,
    };

    console.log("📤 API’ye gönderilen veri:", productData);

    // -------------------------------------
    // 5) API isteği
    // -------------------------------------
    await apiClient.createProduct(productData);

    // -------------------------------------
    // 6) Sayfa yenile + yönlendir
    // -------------------------------------
    revalidatePath("/administor/add-product");
    redirect("/administor/products");

  } catch (err) {
    console.error("❌ Frontend createProduct hatası:", err);
    return "Ürün eklenirken bir hata oluştu.";
  }
}
