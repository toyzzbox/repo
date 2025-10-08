// page.tsx
import { prisma } from "@/lib/prisma";
import ProductForm from "./ProductForm";

export default async function Page() {
  const [brands, categories, medias, productGroups, attributes] = await Promise.all([
    prisma.brand.findMany(),
    prisma.category.findMany(),
    prisma.media.findMany({
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.productGroup.findMany(),
    prisma.attribute.findMany(),
  ]);

  // ✅ Debug: Console'da medias'ı görelim
  console.log("📸 Total medias:", medias.length);
  console.log("📸 First media:", medias[0]);
  console.log("📸 First media URLs:", medias[0]?.urls);

  const serialize = (data: any) => JSON.parse(JSON.stringify(data));

  // ✅ Serialize'dan sonra da kontrol edelim
  const serializedMedias = serialize(medias);
  console.log("📦 Serialized first media:", serializedMedias[0]);
  console.log("📦 Serialized first media URLs:", serializedMedias[0]?.urls);

  return (
    <ProductForm
      brands={serialize(brands)}
      categories={serialize(categories)}
      medias={serializedMedias}
      productGroups={serialize(productGroups)}
      attributes={serialize(attributes)}
    />
  );
}