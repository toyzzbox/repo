import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/(frontend)/product/ProductCard";
import FilterSidebar from "./FilterSideBar";
import MobileFilter from "./MobileFilter";
import type { Prisma } from ".prisma/client";
interface Props {
  params: { slug: string[] };
  searchParams?: { [key: string]: string | string[] | undefined };
}

// Tip tanımı: alt kategorileri de içeren category yapısı
type CategoryWithChildren = Prisma.CategoryGetPayload<{
  include: { children: { include: { children: true } } };
}>;

// Alt kategorileri derinlemesine toplayan fonksiyon
function collectCategoryIds(category: CategoryWithChildren): string[] {
  return [
    category.id,
    ...category.children.flatMap(collectCategoryIds),
  ];
}

export default async function CategoryPage({ params, searchParams = {} }: Props) {
  const slugSegments = params.slug;
  const currentSlug = slugSegments.at(-1)!;

  // Ana kategoriyi ve alt kategorileri getir
  const category = await prisma.category.findUnique({
    where: { slug: currentSlug },
    include: {
      children: {
        include: { children: true }, // 2. seviye derinlik
      },
    },
  });

  if (!category) return notFound();

  const categoryIds = collectCategoryIds(category);

  // Fiyat filtreleri
  const minPrice = Number(searchParams.price_gte ?? 0);
  const maxPrice = Number(searchParams.price_lte ?? 99999);

  // Marka ve özellik filtreleri
  const selectedBrand = typeof searchParams.brand === "string" ? searchParams.brand : undefined;
  const selectedAttributes = Array.isArray(searchParams.attribute)
    ? searchParams.attribute
    : searchParams.attribute
    ? [searchParams.attribute]
    : [];

  // Ürünleri getir
  const products = await prisma.product.findMany({
    where: {
      categories: {
        some: {
          categoryId: { in: categoryIds },
        },
      },
      brandId: selectedBrand ? selectedBrand : undefined,
      attributes: selectedAttributes.length
        ? {
            some: {
              attributeId: { in: selectedAttributes },
            },
          }
        : undefined,
      price: {
        gte: minPrice,
        lte: maxPrice,
      },
    },
    include: {
      medias: true,
      brand: true,
    },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
      <aside className="hidden md:block">
        <FilterSidebar />
      </aside>
      <main className="md:col-span-3 space-y-4">
        <MobileFilter />
        {products.length === 0 ? (
          <p className="text-gray-500">Ürün bulunamadı.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
