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
    prisma.attribute.findMany(), // ✅ düzeltildi
  ]);

  const serialize = (data: any) => JSON.parse(JSON.stringify(data));

  return (
    <ProductForm
      brands={serialize(brands)}
      categories={serialize(categories)}
      medias={serialize(medias)}
      productGroups={serialize(productGroups)}
      attributes={serialize(attributes)}
    />
  );
}
