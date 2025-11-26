"use server";

import { apiClient } from "@/lib/api-client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createBanner(prevState: any, formData: FormData) {
  try {
    const title = (formData.get("title") as string) || undefined;
    const subtitle = (formData.get("subtitle") as string) || undefined;
    const description = (formData.get("description") as string) || undefined;

    const order = Number(formData.get("order") || 0);
    const placement = formData.get("placement") as "HOME" | "CATEGORY";
    const device = formData.get("device") as "ALL" | "DESKTOP" | "MOBILE";
    const linkType = formData.get("linkType") as
      | "NONE"
      | "PRODUCT"
      | "CATEGORY"
      | "BRAND"
      | "CUSTOM";

    const linkUrl =
      linkType === "CUSTOM"
        ? ((formData.get("linkUrl") as string) || undefined)
        : undefined;

    const categoryId =
      placement === "CATEGORY"
        ? ((formData.get("categoryId") as string) || undefined)
        : undefined;

    const mediaId = formData.get("mediaId") as string;

    if (!mediaId) {
      return "Banner için görsel seçilmelidir.";
    }

    const bannerData = {
      title,
      subtitle,
      description,
      order,
      placement,
      device,
      linkType,
      linkUrl,
      categoryId,
      mediaId,
      isActive: true,
    };

    console.log("📤 API’ye gönderilen banner:", bannerData);

    await apiClient.createBanner(bannerData);

    revalidatePath("/administor/banners");
    redirect("/administor/banners");
  } catch (err) {
    console.error("❌ createBanner hatası:", err);
    return "Banner oluşturulurken hata oluştu.";
  }
}
