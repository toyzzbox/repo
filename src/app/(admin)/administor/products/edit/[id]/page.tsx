import { prisma } from "@/lib/prisma";
import EditProductForm from "@/components/(backend)/product/EditProductForm";
import { Media, Product } from "@/types/product";
import { Brand } from "@/types/brand";
import { Category } from "@/types/category";
import { Attribute } from "@/types/attribute";

type ProductWithRelations = Product & {
  brands: Brand[];
  categories: Category[];
  medias: Media[];
  attributes: Attribute[];
};

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      brands: true,
      categories: true,
      medias: true,
      attributes: true,
    },
  });

  if (!product) {
    return <div>Ürün bulunamadı.</div>;
  }

  const fullProduct = product as ProductWithRelations;

  const brands = await prisma.brand.findMany();
  const categories = await prisma.category.findMany();
  const medias = await prisma.media.findMany();
  const attributes = await prisma.attribute.findMany();

  return (
    <EditProductForm
      product={{
        id: fullProduct.id,
        name: fullProduct.name,
        description: fullProduct.description ?? "",
        price: fullProduct.price,
        brandIds: fullProduct.brands.map((b) => b.id),
        categoryIds: fullProduct.categories.map((c) => c.id),
        mediaIds: fullProduct.medias.map((m) => m.id),
        attributeIds: fullProduct.attributes.map((a) => a.id),
      }}
      brands={brands}
      categories={categories}
      medias={medias}
      attributes={attributes}
    />
  );
}
