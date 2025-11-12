// app/(backend)/administor/products/page.tsx
import { prisma } from "@/lib/prisma";
import ProductForm from "./ProductForm";

export default async function Page() {
  // ✅ Tüm verileri paralel çekelim, ama medyaları `variants` ilişkisiyle
  const [brands, categories, medias, productGroups, attributes] = await Promise.all([
    prisma.brand.findMany(),
    prisma.category.findMany(),
    prisma.media.findMany({
      include: {
        variants: true, // ✅ cdnUrl burada
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.productGroup.findMany(),
    prisma.attribute.findMany(),
  ]);

  // ✅ Medyaları frontend’e uygun formata dönüştür
  const safeMedias = medias.map((media) => ({
    id: media.id,
    urls: media.variants.map((v) => v.cdnUrl), // S3 URL dizisi
    title: media.title,
    altText: media.altText,
    type: media.type,
  }));

  // ✅ Debug (görmek istersen)
  console.log("📸 Total medias:", safeMedias.length);
  console.log("📸 First media URLs:", safeMedias[0]?.urls);

  // ✅ JSON-safe serialize fonksiyonu
  const serialize = (data: any) => JSON.parse(JSON.stringify(data));

  return (
    <ProductForm
      brands={serialize(brands)}
      categories={serialize(categories)}
      medias={serialize(safeMedias)} // ✅ cdnUrl'ler burada
      productGroups={serialize(productGroups)}
      attributes={serialize(attributes)}
    />
  );
}
