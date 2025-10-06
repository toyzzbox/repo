"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface UpdateProductResult {
  ok: boolean;
  message: string;
}

export async function updateProduct(prevState: unknown, formData: FormData): Promise<UpdateProductResult> {
  try {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const serial = formData.get("serial") as string;
    const stock = parseInt(formData.get("stock") as string);
    const price = parseFloat(formData.get("price") as string);
    const discount = formData.get("discount") ? parseFloat(formData.get("discount") as string) : null;
    const groupId = (formData.get("groupId") as string) || null;
    const description = formData.get("description") as string;
    const barcode = formData.get("barcode") as string;
    const slug = formData.get("slug") as string;
    const brandIds = formData.getAll("brandIds[]") as string[];
    const categoryIds = formData.getAll("categoryIds[]") as string[];
    const mediaIds = formData.getAll("mediaIds[]") as string[];

    // Validation
    if (!id || !name) return { ok: false, message: "Ürün ID'si ve adı gereklidir." };
    if (stock < 0) return { ok: false, message: "Stok negatif olamaz." };
    if (price <= 0) return { ok: false, message: "Fiyat pozitif olmalıdır." };

    // 1️⃣ Ürünün varlığını kontrol et
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return { ok: false, message: "Ürün bulunamadı." };

    // 2️⃣ Slug ve barcode benzersizliği
    const slugConflict = await prisma.product.findFirst({
      where: { slug, NOT: { id } },
    });
    if (slugConflict) return { ok: false, message: "Bu slug başka bir üründe kullanılıyor." };

    const barcodeConflict = await prisma.product.findFirst({
      where: { barcode, NOT: { id } },
    });
    if (barcodeConflict) return { ok: false, message: "Bu barkod başka bir üründe kullanılıyor." };

    // 3️⃣ Geçerli medya ID'lerini filtrele
    const validMedia = await prisma.media.findMany({
      where: { id: { in: mediaIds } },
      select: { id: true },
    });
    const mediaConnections = validMedia.map((m, index) => ({
      productId: id,
      mediaId: m.id,
      order: index,
    }));

    // 4️⃣ Transaction: ürün güncelle + medya
    await prisma.$transaction(async (tx) => {
      await tx.product.update({
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
          slug,
          brands: { set: [], connect: brandIds.map((bid) => ({ id: bid })) },
          categories: { set: [], connect: categoryIds.map((cid) => ({ id: cid })) },
        },
      });

      await tx.productMedia.deleteMany({ where: { productId: id } });
      if (mediaConnections.length > 0) {
        await tx.productMedia.createMany({ data: mediaConnections });
      }
    });

    // 5️⃣ Cache ve yönlendirme
    revalidatePath("/admin/products");
    redirect("/admin/products");

    return { ok: true, message: "Ürün başarıyla güncellendi." };
  } catch (error: any) {
    console.error("Ürün güncellenirken hata:", error);
    return { ok: false, message: "Ürün güncellenirken bir hata oluştu." };
  }
}
