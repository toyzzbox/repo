"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import slugify from "slugify";
import { revalidatePath } from "next/cache";

/** Yardımcı: Seçilen kategorilerin tüm ata-kimliklerini döndürür */
async function collectAncestorIds(initialIds: string[]): Promise<string[]> {
  const allIds = new Set<string>(initialIds);
  const stack = [...initialIds];

  while (stack.length > 0) {
    const id = stack.pop()!;
    
    try {
      const category = await prisma.category.findUnique({
        where: { id },
        select: { parentId: true },
      });

      if (category?.parentId && !allIds.has(category.parentId)) {
        allIds.add(category.parentId);
        stack.push(category.parentId);
      }
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      // Kategori bulunamazsa devam et
      continue;
    }
  }

  return [...allIds];
}

const schema = z.object({
  groupId: z.string().optional().transform(val => val === "" ? undefined : val),
  name: z.string().min(1, "Ürün adı gerekli"),
  serial: z.string().optional().transform(val => val === "" ? undefined : val),
  stock: z.coerce.number().min(0, "Stok 0'dan küçük olamaz").optional(),
  price: z.coerce.number().min(0, "Fiyat 0'dan küçük olamaz"),
  discount: z.coerce.number().min(0, "İndirim 0'dan küçük olamaz").max(100, "İndirim 100'den büyük olamaz").optional(),
  brandIds: z.array(z.string()).default([]),
  categoryIds: z.array(z.string()).default([]),
  mediaIds: z.array(z.string()).default([]),
  description: z.string().optional().transform(val => val === "" ? undefined : val),
});

type CreateProductResult = {
  success?: boolean;
  error?: string;
  productId?: string;
} | null;

export async function createProduct(prevState: any, formData: FormData): Promise<CreateProductResult> {
  try {
    // 1️⃣ Form verisini oku
    const raw = {
      groupId: formData.get("groupId")?.toString(),
      name: formData.get("name")?.toString(),
      serial: formData.get("serial")?.toString(),
      stock: formData.get("stock")?.toString(),
      price: formData.get("price")?.toString(),
      discount: formData.get("discount")?.toString(),
      brandIds: formData.getAll("brandIds[]").map(id => id.toString()),
      categoryIds: formData.getAll("categoryIds[]").map(id => id.toString()),
      mediaIds: formData.getAll("mediaIds[]").map(id => id.toString()),
      description: formData.get("description")?.toString(),
    };

    // 2️⃣ Veriyi doğrula
    const data = schema.parse(raw);

    // Debug logları
    console.log("Parsed data:", {
      name: data.name,
      mediaIds: data.mediaIds,
      brandIds: data.brandIds,
      categoryIds: data.categoryIds,
      groupId: data.groupId,
    });

    // 3️⃣ İlişkili verilerin varlığını kontrol et
    const validationPromises = [];

    // Grup kontrolü
    if (data.groupId) {
      validationPromises.push(
        prisma.productGroup.findUnique({
          where: { id: data.groupId },
          select: { id: true }
        }).then(group => {
          if (!group) throw new Error(`Ürün grubu bulunamadı: ${data.groupId}`);
        })
      );
    }

    // Medya kontrolü
    if (data.mediaIds.length > 0) {
      validationPromises.push(
        prisma.media.findMany({
          where: { id: { in: data.mediaIds } },
          select: { id: true }
        }).then(medias => {
          if (medias.length !== data.mediaIds.length) {
            const foundIds = medias.map(m => m.id);
            const missingIds = data.mediaIds.filter(id => !foundIds.includes(id));
            throw new Error(`Medya bulunamadı: ${missingIds.join(", ")}`);
          }
        })
      );
    }

    // Marka kontrolü
    if (data.brandIds.length > 0) {
      validationPromises.push(
        prisma.brand.findMany({
          where: { id: { in: data.brandIds } },
          select: { id: true }
        }).then(brands => {
          if (brands.length !== data.brandIds.length) {
            const foundIds = brands.map(b => b.id);
            const missingIds = data.brandIds.filter(id => !foundIds.includes(id));
            throw new Error(`Marka bulunamadı: ${missingIds.join(", ")}`);
          }
        })
      );
    }

    // Kategori kontrolü
    if (data.categoryIds.length > 0) {
      validationPromises.push(
        prisma.category.findMany({
          where: { id: { in: data.categoryIds } },
          select: { id: true }
        }).then(categories => {
          if (categories.length !== data.categoryIds.length) {
            const foundIds = categories.map(c => c.id);
            const missingIds = data.categoryIds.filter(id => !foundIds.includes(id));
            throw new Error(`Kategori bulunamadı: ${missingIds.join(", ")}`);
          }
        })
      );
    }

    // Tüm validasyonları bekle
    await Promise.all(validationPromises);

    // 4️⃣ Kategori zincirini genişlet
    const fullCategoryIds = data.categoryIds.length > 0 
      ? await collectAncestorIds(data.categoryIds)
      : [];

    // 5️⃣ Benzersiz slug oluştur
    const baseSlug = slugify(`${data.name}-${data.serial || Date.now()}`, {
      lower: true,
      strict: true,
    });

    let slug = baseSlug;
    let counter = 1;

    // Slug benzersizliğini kontrol et
    while (true) {
      const existingProduct = await prisma.product.findUnique({
        where: { slug },
        select: { id: true }
      });

      if (!existingProduct) break;

      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // 6️⃣ Ürünü kaydet
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        serial: data.serial,
        stock: data.stock,
        price: data.price,
        discount: data.discount || 0,
        description: data.description,
        
        // İlişkiler
        group: data.groupId ? { connect: { id: data.groupId } } : undefined,
        
        medias: data.mediaIds.length > 0 
          ? { connect: data.mediaIds.map((id) => ({ id })) }
          : undefined,
          
        brands: data.brandIds.length > 0
          ? { connect: data.brandIds.map((id) => ({ id })) }
          : undefined,
          
        categories: fullCategoryIds.length > 0
          ? { connect: fullCategoryIds.map((id) => ({ id })) }
          : undefined,
      },
      include: {
        medias: {
          select: { id: true, urls: true }
        },
        brands: {
          select: { id: true, name: true }
        },
        categories: {
          select: { id: true, name: true }
        },
        group: {
          select: { id: true, name: true }
        }
      }
    });

    console.log("Ürün başarıyla oluşturuldu:", {
      id: product.id,
      name: product.name,
      slug: product.slug,
      mediaCount: product.medias.length,
      brandCount: product.brands.length,
      categoryCount: product.categories.length,
    });

    // 7️⃣ Cache'i yenile
    revalidatePath("/products");
    revalidatePath("/admin/products");

    return {
      success: true,
      productId: product.id,
    };

  } catch (error) {
    console.error("Ürün oluşturulurken hata:", error);

    // Zod validasyon hatası
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => 
        `${err.path.join(".")}: ${err.message}`
      ).join(", ");
      return {
        error: `Validasyon hatası: ${errorMessages}`,
      };
    }

    // Prisma hatası
    if (error instanceof Error) {
      // Unique constraint hatası
      if (error.message.includes("Unique constraint")) {
        return {
          error: "Bu ürün adı veya seri numarası zaten kullanılıyor.",
        };
      }

      // Foreign key hatası
      if (error.message.includes("Foreign key constraint")) {
        return {
          error: "İlişkili verilerden biri bulunamadı.",
        };
      }

      return {
        error: error.message,
      };
    }

    return {
      error: "Ürün oluşturulurken beklenmeyen bir hata oluştu.",
    };
  }
}