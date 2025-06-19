// src/app/categories/[...slug]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { ProductCard } from "@/components/(frontend)/product/ProductCard";

/** Alt-torun tüm kategori ID’lerini toplayan yardımcı */
type CatWithChildren = Prisma.CategoryGetPayload<{
  include: { children: { include: { children: true } } };
}>;
function collectCategoryIds(cat: CatWithChildren): string[] {
  return [cat.id, ...cat.children.flatMap(collectCategoryIds)];
}

interface PageProps {
  params: { slug: string[] };                          // [...slug]
  searchParams?: { [k: string]: string | string[] | undefined };
}

export default async function CategoryPage({ params, searchParams = {} }: PageProps) {
  /* 1. En derindeki slug hangi kategori? */
  const slugSegments = params.slug;
  const currentSlug  = slugSegments.at(-1)!;

  /* 2. Kategori + altlarını al */
  const category = await prisma.category.findUnique({
    where: { slug: currentSlug },
    include: { children: { include: { children: true } } },  // derin çek
  });

  if (!category) return notFound();

  /* 3. Alt-torun ID’lerini çıkar */
  const categoryIds = collectCategoryIds(category);

  /* 4. O ID listesine bağlı aktif ürünleri getir */
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      categories: { some: { id: { in: categoryIds } } },   // many-to-many
    },
    select: {
      id: true,
      slug: true,
      name: true,
      price: true,
      medias: { select: { urls: true } },
    },
  });

  /* 5. Render */
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">{category.name}</h1>

      {products.length ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(p => (
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
