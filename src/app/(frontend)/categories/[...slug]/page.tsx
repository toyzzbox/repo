import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { ProductCard } from "@/components/(frontend)/product/ProductCard";

type DeepCategory = Prisma.CategoryGetPayload<{
  include: {
    children: {
      include: {
        children: {
          include: {
            children: true;
          };
        };
      };
    };
  };
}>;

function collectCategoryIds(category: DeepCategory): string[] {
  const children = category.children ?? [];
  return [category.id, ...children.flatMap(collectCategoryIds)];
}

export default async function CategoryPage({
  params,
  searchParams = {},
}: {
  params: { slug: string[] };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const slug = params.slug.at(-1)!;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      children: {
        include: {
          children: {
            include: {
              children: true,
            },
          },
        },
      },
    },
  });

  if (!category) return notFound();

  const categoryIds = collectCategoryIds(category);

  // ✅ Alt kategorileri ürün sayısıyla al
  const subcategories = await prisma.category.findMany({
    where: { parentId: category.id },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      categories: {
        some: {
          id: { in: categoryIds },
        },
      },
    },
    select: {
      id: true,
      slug: true,
      name: true,
      price: true,
      medias: {
        select: { urls: true },
      },
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">{category.name}</h1>

      {/* ✅ Alt kategoriler listesi */}
      {subcategories.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-medium mb-2">Alt Kategoriler</h2>
          <ul className="space-y-1">
            {subcategories.map((sub) => (
              <li key={sub.id}>
                {sub.name}{" "}
                <span className="text-sm text-muted-foreground">
                  ({sub._count.products} ürün)
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ✅ Ürün listesi */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
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
