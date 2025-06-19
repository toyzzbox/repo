import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Prisma } from "@prisma/client";
import Link from "next/link";
import SortSelect from "@/components/(frontend)/category/SortSelect";
import CategoryFilters from "@/components/(frontend)/category/CategoryFilters";
import { ProductCard } from "@/components/(frontend)/product/ProductCard";

/* ───────── Alt-torunları dâhil tip & yardımcı ───────── */
type DeepCategory = Prisma.CategoryGetPayload<{
  include: {
    children: { include: { children: { include: { children: true } } } };
  };
}>;

function collectCategoryIds(cat: DeepCategory): string[] {
  const kids = cat.children ?? [];
  return [cat.id, ...kids.flatMap(collectCategoryIds)];
}

/* ───────────── Server Component ───────────── */
export default async function CategoryPage({
  params,
  searchParams = {},
}: {
  params: { slug: string[] };
  searchParams?: { [k: string]: string | string[] | undefined };
}) {
  /* 1) Kategori + hiyerarşi */
  const slug = params.slug.at(-1)!;
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      children: { include: { children: { include: { children: true } } } },
    },
  });
  if (!category) return notFound();

  const categoryIds = collectCategoryIds(category);

  /* 2) URL’den filtre parametrelerini oku */
  const selectedCategoryIds = Array.isArray(searchParams.category)
    ? (searchParams.category as string[])
    : searchParams.category
    ? [searchParams.category as string]
    : [];

  const selectedBrandSlugs = Array.isArray(searchParams.brand)
    ? (searchParams.brand as string[])
    : searchParams.brand
    ? [searchParams.brand as string]
    : [];

  /* 3) Alt kategoriler (ürün sayısıyla) */
  const subcategories = await prisma.category.findMany({
    where: { parentId: category.id },
    include: { _count: { select: { products: true } } },
  });

  /* 4) Markalar (yalnızca bu kategori kapsamındaki) */
  const brands = await prisma.brand.findMany({
    where: {
      products: {
        some: {
          categories: { some: { id: { in: categoryIds } } },
        },
      },
    },
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
  });

  /* 5) Sıralama parametresi → orderBy */
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

  /* 6) Ürünleri çek (filtreler + sıralama) */
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      categories: {
        some: {
          id: {
            in:
              selectedCategoryIds.length > 0
                ? selectedCategoryIds
                : categoryIds,
          },
        },
      },
      ...(selectedBrandSlugs.length > 0 && {
        brands: { some: { slug: { in: selectedBrandSlugs } } },
      }),
    },
    orderBy,
    select: {
      id: true,
      slug: true,
      name: true,
      price: true,
      medias: { select: { urls: true } },
    },
  });

  /* 7) UI */
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Başlık + sıralama */}
      <h1 className="text-2xl font-semibold mb-6">{category.name}</h1>
      <SortSelect />

      {/* Filtre paneli */}
      <CategoryFilters subcategories={subcategories} brands={brands} />

      {/* Alt kategoriler listesi (linkli) */}
      {subcategories.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-medium mb-2">Alt Kategoriler</h2>
          <ul className="space-y-1">
            {subcategories.map((sub) => (
              <li key={sub.id}>
                <Link
                  href={`/categories/${sub.slug}`}
                  className="hover:underline"
                >
                  {sub.name}
                </Link>{" "}
                <span className="text-sm text-muted-foreground">
                  ({sub._count.products} ürün)
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Ürün listesi */}
      {products.length ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">
          Filtrelere uyan ürün bulunamadı.
        </p>
      )}
    </div>
  );
}
