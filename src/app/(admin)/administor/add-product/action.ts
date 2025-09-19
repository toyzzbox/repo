"use server";

import { apiClient } from '@/lib/api-client';
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(prevState: any, formData: FormData) {
  try {
    const productData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      discount: formData.get("discount") ? parseFloat(formData.get("discount") as string) : undefined,
      stock: formData.get("stock") ? parseInt(formData.get("stock") as string) : undefined,
      barcode: formData.get("barcode") as string || undefined,
      serial: formData.get("serial") as string || undefined,
      brandIds: formData.getAll("brandIds[]") as string[],
      categoryIds: formData.getAll("categoryIds[]") as string[],
      attributeIds: formData.getAll("attributeIds[]") as string[],
      groupId: formData.get("groupId") as string || undefined,
      mediaIds: formData.getAll("mediaIds[]") as string[],
    };

    console.log("Frontend'den gönderilen veri:", JSON.stringify(productData, null, 2));
    
    await apiClient.createProduct(productData);
    
    revalidatePath("/administor/add-product");
    redirect("/administor/products");
    
  } catch (error: unknown) {
    console.error("Frontend hatası:", error);
    
    if (error instanceof Error) {
      console.error("Hata mesajı:", error.message);
      return "Ürün eklenirken bir hata oluştu: " + error.message;
    }
    
    if (typeof error === 'object' && error !== null) {
      console.error("Object hatası:", JSON.stringify(error, null, 2));
      return "Ürün eklenirken bir hata oluştu: " + JSON.stringify(error);
    }
    
    console.error("Bilinmeyen hata:", error);
    return "Ürün eklenirken bilinmeyen bir hata oluştu";
  }
}