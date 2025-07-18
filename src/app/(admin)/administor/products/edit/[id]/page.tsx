import { prisma } from "@/lib/prisma";
import EditProductForm from "@/components/(backend)/product/EditProductForm";
import { Media, Product } from "@/types/product";
import { Brand } from "@/types/brand";
import { Category } from "@/types/category";
import { Attribute } from "@/types/attribute";

// ProductGroup interface'ini burada tanımlayın
interface ProductGroup {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

type ProductWithRelations = Product & {
  brands: Brand[];
  categories: Category[];
  medias: Media[];
  attributes: Attribute[];
  group?: ProductGroup; // Schema'da 'group' olarak tanımlanmış
};

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      brands: true,
      categories: true,
      medias: {
        orderBy: {
          createdAt: 'desc', // 🧠 Önemli kısım
        },
      },
      attributes: true,
      group: true, // Schema'da 'group' olarak tanımlanmış
    },
  });

  if (!product) {
    return <div>Ürün bulunamadı.</div>;
  }

  const fullProduct = product as ProductWithRelations;

  // Tüm seçenekleri çek
  const brands = await prisma.brand.findMany();
  const categories = await prisma.category.findMany();
  const medias = await prisma.media.findMany();
  const attributes = await prisma.attribute.findMany();
  const productGroups = await prisma.productGroup.findMany(); // ProductGroup tablonuz var

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
        groupId: fullProduct.groupId ?? "", // Schema'da groupId var
        brandIds: fullProduct.brands.map((b) => b.id),
        categoryIds: fullProduct.categories.map((c) => c.id),
        mediaIds: fullProduct.medias.map((m) => m.id),
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