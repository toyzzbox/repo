import { prisma } from "@/lib/prisma";
import ProductForm from "./ProductForm";

async function getAttributes() {
  const attributes = await prisma.attribute.findMany();
  return attributes;
}


export default async function Page() {
  const brands = await prisma.brand.findMany();
  const categories = await prisma.category.findMany();
  const medias = await prisma.media.findMany();

  const safeBrands = JSON.parse(JSON.stringify(brands));
  const safeCategories = JSON.parse(JSON.stringify(categories));
  const safeMedias = JSON.parse(JSON.stringify(medias)); // ✅ Mediaları serialize et
  const attributes = await getAttributes();

  return (
    <ProductForm
      brands={safeBrands}
      categories={safeCategories}
      medias={safeMedias}
      attributes={attributes} // ✅ Mediaları forma props olarak gönder
    />
  );
}
