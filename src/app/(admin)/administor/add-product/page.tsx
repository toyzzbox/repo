import { prisma } from "@/lib/prisma";
import ProductForm from "./ProductForm";

export default async function Page() {
  const [brands, categories, medias, productGroups] = await Promise.all([
    prisma.brand.findMany(),
    prisma.category.findMany(),
    prisma.media.findMany({
      orderBy: {
        createdAt: "desc", // 🔥 En son yüklenen medyalar en başta
      },
    }),
    prisma.productGroup.findMany(),
  ]);

  const serialize = (data: any) => JSON.parse(JSON.stringify(data));

  return (
    <ProductForm
      brands={serialize(brands)}
      categories={serialize(categories)}
      medias={serialize(medias)} // ✅ Artık sıralı geliyor
      productGroups={serialize(productGroups)}
    />
  );
}
