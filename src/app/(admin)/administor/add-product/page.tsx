import { prisma } from "@/lib/prisma";
import ProductForm from "./ProductForm";

export default async function Page() {
  const [brands, categories, medias, productGroups] = await Promise.all([
    prisma.brand.findMany(),
    prisma.category.findMany(),
    prisma.media.findMany(),
    prisma.productGroup.findMany(), // ✅ Eksik olan buydu
  ]);

  const serialize = (data: any) => JSON.parse(JSON.stringify(data));

  return (
    <ProductForm
      brands={serialize(brands)}
      categories={serialize(categories)}
      medias={serialize(medias)}
      productGroups={serialize(productGroups)} // ✅ Burada forma gönderiyoruz
    />
  );
}
