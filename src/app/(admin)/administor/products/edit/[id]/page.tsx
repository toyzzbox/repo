import { prisma } from "@/lib/prisma";
import EditProductForm from "@/components/(backend)/product/EditProductForm";
import { Media, Product } from "@/types/product";
import { Brand } from "@/types/brand";
import { Category } from "@/types/category";
import { Attribute } from "@/types/attribute";

interface ProductGroup {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

type ProductWithRelations = Product & {
  brands: Brand[];
  categories: Category[];
  medias: {
    media: Media;
    order: number;
  }[];
  attributes: Attribute[];
  group?: ProductGroup;
};

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      brands: true,
      categories: true,
      attributes: true,
      group: true,
      medias: {
        orderBy: { order: "asc" },
        include: {
          media: true,
        },
      },
    },
  });

  if (!product) {
    return <div>Ürün bulunamadı.</div>;
  }

  const fullProduct = product as ProductWithRelations;

  // Tüm seçenekleri çek
  const brands = await prisma.brand.findMany();
  const categories = await prisma.category.findMany();
  const medias = await prisma.media.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  const attributes = await prisma.attribute.findMany();
  const productGroups = await prisma.productGroup.findMany();

  return (
    <EditProductForm
      product={{
        id: fullProduct.id,
        name: fullProduct.name,
        description: fullProduct.description ?? "",
        serial: fullProduct.serial ?? "",
        stock: fullProduct.stock ?? 0,
        price: fullProduct.price,
        discount: fullProduct.discount ?? 0,
        groupId: fullProduct.groupId ?? "",
        brandIds: fullProduct.brands.map((b) => b.id),
        categoryIds: fullProduct.categories.map((c) => c.id),
        mediaIds: fullProduct.medias.map((m) => m.media.id), // ✅ düzeltildi
        attributeIds: fullProduct.attributes.map((a) => a.id),
      }}
      brands={brands}
      categories={categories}
      medias={medias}
      attributes={attributes}
      productGroups={productGroups}
    />
  );
}
