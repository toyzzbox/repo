import { prisma } from "@/lib/prisma";
import ProductForm from "./ProductForm";

export default async function Page() {
  const brands = await prisma.brand.findMany();
  const categories = await prisma.category.findMany();
  const medias = await prisma.media.findMany();

  const safeBrands = JSON.parse(JSON.stringify(brands));
  const safeCategories = JSON.parse(JSON.stringify(categories));
  const safeMedias = JSON.parse(JSON.stringify(medias)); // ✅ Mediaları serialize et

  return (
    <ProductForm
      brands={safeBrands}
      categories={safeCategories}
      medias={safeMedias} // ✅ Mediaları forma props olarak gönder
    />
  );
}
