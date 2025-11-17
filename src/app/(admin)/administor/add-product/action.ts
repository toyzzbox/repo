"use server";

import { apiClient } from "@/lib/api-client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(prevState: any, formData: FormData) {
  try {
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

    const brandIds = formData.getAll("brandIds[]") as string[];
    const categoryIds = formData.getAll("categoryIds[]") as string[];
    const attributeIds = formData.getAll("attributeIds[]") as string[];

    // -----------------------------
    // ⭐ Medya: Duplicate temizleme
    // -----------------------------
    const mediaIds = formData.getAll("mediaIds[]") as string[];
    const mediaOrders = formData
      .getAll("mediaOrders[]")
      .map((v) => Number(v));

    // 1) Tekilleştir — aynı mediaId birden fazla gelmişse at
    const uniqueMediaMap = new Map<string, number>();

    mediaIds.forEach((id, index) => {
      if (!uniqueMediaMap.has(id)) {
        uniqueMediaMap.set(id, mediaOrders[index]);
      }
    });

    const uniqueMediaIds = Array.from(uniqueMediaMap.keys());
    const uniqueMediaOrders = Array.from(uniqueMediaMap.values());

    // -----------------------------
    // ⭐ NestJS API'ye gönderilecek payload
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

      // 🔥 Artık yalnızca tekil medya ID + order gönderiyoruz
      mediaIds: uniqueMediaIds,
      mediaOrders: uniqueMediaOrders,
    };

    console.log("📤 API’ye gönderilen veri:", productData);

    await apiClient.createProduct(productData);

    revalidatePath("/administor/add-product");
    redirect("/administor/products");

  } catch (err) {
    console.error("❌ Frontend createProduct hatası:", err);
    return "Ürün eklenirken bir hata oluştu.";
  }
}
