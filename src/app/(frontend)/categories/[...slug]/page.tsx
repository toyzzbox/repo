import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { ProductCard } from "@/components/(frontend)/product/ProductCard";

// ✅ Derin kategori tipi
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

// ✅ Derin kategori ID toplayıcı
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

  // ✅ Kategori + tüm çocuklarını (3 seviye) al
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

  // ✅ Alt–torun–üst tüm ID’leri topla
  const categoryIds = collectCategoryIds(category);

  // ✅ O kategori(ler)le ilişkili aktif ürünleri getir
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
