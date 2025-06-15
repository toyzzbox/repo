// src/app/categories/[...slug]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Prisma } from "@prisma/client";           // ✅ DOĞRU import
import { ProductCard } from "@/components/(frontend)/product/ProductCard";
import FilterSidebar from "./FilterSideBar";
import MobileFilter from "./MobileFilter";

type CategoryWithChildren = Prisma.CategoryGetPayload<{
  include: { children: { include: { children: true } } };
}>;

/** Alt–torun tüm kategori ID’lerini toplar */
function collectCategoryIds(cat: CategoryWithChildren): string[] {
  return [cat.id, ...cat.children.flatMap(collectCategoryIds)];
}

/**
 * Next.js 15+: params artık Promise
 * ───────────────────────────────
 */
interface PageProps {
  params: Promise<{ slug: string[] }>;
  searchParams?: { [k: string]: string | string[] | undefined };
}

export default async function CategoryPage({ params, searchParams = {} }: PageProps) {
  const { slug: slugSegments } = await params;          // ✅ await ediliyor
  const currentSlug = slugSegments.at(-1)!;

  // Ana kategori + alt kategoriler
  const category = await prisma.category.findUnique({
    where: { slug: currentSlug },
    include: { children: { include: { children: true } } },
  });
  if (!category) return notFound();

  const categoryIds = collectCategoryIds(category);

  // ---- Filtreler -----------------------------------------------------------
  const minPrice = Number(searchParams.price_gte ?? 0);
  const maxPrice = Number(searchParams.price_lte ?? 99_999);
  const selectedBrand =
    typeof searchParams.brand === "string" ? searchParams.brand : undefined;
  const selectedAttributes = Array.isArray(searchParams.attribute)
    ? searchParams.attribute
    : searchParams.attribute
    ? [searchParams.attribute]
    : [];

  // ---- Ürün sorgusu --------------------------------------------------------
  const products = await prisma.product.findMany({
    where: {
      categories: { some: { categoryId: { in: categoryIds } } },
      brandId: selectedBrand,
      attributes: selectedAttributes.length
        ? { some: { attributeId: { in: selectedAttributes } } }
        : undefined,
      price: { gte: minPrice, lte: maxPrice },
    },
    include: { medias: true, brand: true },
  });

  // ---- UI -----------------------------------------------------------------
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
      <aside className="hidden md:block"><FilterSidebar /></aside>
      <main className="md:col-span-3 space-y-4">
        <MobileFilter />
        {products.length === 0 ? (
          <p className="text-gray-500">Ürün bulunamadı.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </main>
    </div>
  );
}
