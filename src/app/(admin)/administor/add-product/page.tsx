import { prisma } from "@/lib/prisma";
import ProductForm from "./ProductForm";

export default async function Page() {
  const brands = await prisma.brand.findMany();
  const safeBrands = JSON.parse(JSON.stringify(brands)); // serialize edilmeye uygun hale getir

  return <ProductForm brands={safeBrands} />;
}