import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Prisma } from "@prisma/client";
import Link from "next/link";
import SortSelect from "@/components/(frontend)/category/SortSelect";
import { ProductCard } from "@/components/(frontend)/product/ProductCard";

/* ───────── Alt-torunları dâhil tip ve yardımcı ───────── */
type DeepCategory = Prisma.CategoryGetPayload<{
  include: {
    children: {
      include: {
        children: {
          include: { children: true };
        };
      };
    };
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

  /* 2) Alt kategoriler (ürün sayısıyla) */
  const subcategories = await prisma.category.findMany({
    where: { parentId: category.id },
    include: { _count: { select: { products: true } } },
  });

  /* 3) Sıralama parametresi → orderBy */
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

  /* 4) Ürünleri çek */
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      categories: { some: { id: { in: categoryIds } } },
    },
    orderBy, // ← sıralama burada
    select: {
      id: true,
      slug: true,
      name: true,
      price: true,
      medias: { select: { urls: true } },
    },
  });

  /* 5) UI */
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">{category.name}</h1>

      {/* Sıralama dropdown’u */}
      <SortSelect />

      {/* Alt kategoriler */}
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
          Bu kategoride henüz ürün bulunmuyor.
        </p>
      )}
    </div>
  );
}
