import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Prisma } from "@prisma/client";
import Link from "next/link";
import SortSelect from "@/components/(frontend)/category/SortSelect";
import CategoryFilters from "@/components/(frontend)/category/CategoryFilters";
import { ProductCard } from "@/components/(frontend)/product/ProductCard";
import MobileFilterButton from "./MobileFilterButton";

/* ----------- tip & yardımcı ----------- */
type DeepCategory = Prisma.CategoryGetPayload<{
  include: { children: { include: { children: { include: { children: true } } } } };
}>;
const collectCategoryIds = (c: DeepCategory): string[] => [
  c.id,
  ...c.children.flatMap(collectCategoryIds),
];

/* ------------- Page ------------- */
export default async function CategoryPage({
  params,
  searchParams = {},
}: {
  params: { slug: string[] };
  searchParams?: { [k: string]: string | string[] | undefined };
}) {
  const slug = params.slug.at(-1)!;

  /* 1. Kategori + hiyerarşi */
  const category = await prisma.category.findUnique({
    where: { slug },
    include: { children: { include: { children: { include: { children: true } } } } },
  });
  if (!category) return notFound();

  const categoryIds = collectCategoryIds(category);

  /* 2. URL’den filtreleri al */
  const arr = (v: unknown) => (Array.isArray(v) ? v : v ? [v] : []) as string[];
  const selectedCatIds = arr(searchParams.category);
  const selectedBrands = arr(searchParams.brand);
  const selectedAttrIds = arr(searchParams.attribute);

  const minPrice = Number(searchParams.minPrice) || undefined;
  const maxPrice = Number(searchParams.maxPrice) || undefined;

  /* 3. Alt kategoriler */
  const subcategories = await prisma.category.findMany({
    where: { parentId: category.id },
    select: { id: true, name: true, slug: true, _count: { select: { products: true } } },
  });

  /* 4. İlgili markalar */
  const brands = await prisma.brand.findMany({
    where: {
      products: {
        some: { categories: { some: { id: { in: categoryIds } } } },
      },
    },
    select: { slug: true, name: true },
    orderBy: { name: "asc" },
  });

  /* 5. Attribute grupları */
  const attributeGroups = await prisma.attributeGroup.findMany({
    where: {
      attributes: {
        some: {
          products: { some: { categories: { some: { id: { in: categoryIds } } } } },
        },
      },
    },
    select: {
      id: true,
      name: true,
      attributes: { select: { id: true, name: true } },
    },
    orderBy: { name: "asc" },
  });

  /* 6. Sıralama */
  const { sort = "newest" } = searchParams;
  const orderBy =
    sort === "price_asc"
      ? { price: "asc" }
      : sort === "price_desc"
      ? { price: "desc" }
      : sort === "name_asc"
      ? { name: "asc" }
      : sort === "name_desc"
      ? { name: "desc" }
      : { createdAt: "desc" };

  /* 7. WHERE koşulu */
  const where: Prisma.ProductWhereInput = {
    isActive: true,
    categories: {
      some: {
        id: { in: selectedCatIds.length ? selectedCatIds : categoryIds },
      },
    },
  };
  if (selectedBrands.length)
    where.brands = { some: { slug: { in: selectedBrands } } };
  if (selectedAttrIds.length)
    where.attributes = { some: { id: { in: selectedAttrIds } } };
  if (minPrice || maxPrice)
    where.price = {
      ...(minPrice && { gte: minPrice }),
      ...(maxPrice && { lte: maxPrice }),
    };

  /* 8. Ürünleri getir */
  const products = await prisma.product.findMany({
    where,
    orderBy,
    select: {
      id: true,
      slug: true,
      name: true,
      price: true,
      medias: { select: { urls: true } },
    },
  });

  /* -------- UI -------- */
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">{category.name}</h1>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mb-6">
  <div className="w-full sm:w-auto">
    <MobileFilterButton
      subcategories={subcategories}
      brands={brands}
      attributeGroups={attributeGroups}
    />
  </div>
  <div className="w-full sm:w-auto sm:ml-auto">
    <SortSelect />
  </div>
</div>
  

      <div className="grid lg:grid-cols-[260px_1fr] gap-8">
        {/* SOL: Filtre paneli */}
        <div className="hidden lg:block">
  <CategoryFilters
    subcategories={subcategories}
    brands={brands}
    attributeGroups={attributeGroups}
  />
</div>
        {/* SAĞ: Ürün listesi */}
        {products.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Filtrelere uyan ürün bulunamadı.</p>
        )}
      </div>
    </div>
  );
}
