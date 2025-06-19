import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { ProductCard } from "@/components/(frontend)/product/ProductCard";

// 🔁 Kategori + çocuklarını temsil edecek tip
type CategoryWithDeepChildren = Prisma.CategoryGetPayload<{
  include: {
    children: {
      include: {
        children: {
          include: {
            children: true; // 3 seviye derinlik
          };
        };
      };
    };
  };
}>;

// 🧠 Derin kategori ID’lerini toplayan fonksiyon
function collectCategoryIds(category: CategoryWithDeepChildren): string[] {
  const children = category.children ?? [];
  const childIds = children.flatMap(collectCategoryIds);
  return [category.id, ...childIds];
}

// 🔧 Sayfa bileşeni
interface PageProps {
  params: Promise<{ slug: string[] }>; // ✅ Next.js 15: Promise olarak beklenmeli
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function CategoryPage({ params, searchParams = {} }: PageProps) {
  const { slug } = await params;
  const currentSlug = slug.at(-1)!;

  // 🔍 Kategori ve alt kategorilerini çek
  const category = await prisma.category.findUnique({
    where: { slug: currentSlug },
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

  // 📦 Alt–torun ID’lerini topla
  const categoryIds = collectCategoryIds(category);

  // 🛒 Bu kategori(ler)deki ürünleri çek
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      categories: {
        some: {
          id: {
            in: categoryIds,
          },
        },
      },
    },
    select: {
      id: true,
      slug: true,
      name: true,
      price: true,
      medias: {
        select: {
          urls: true,
        },
      },
    },
  });

  // 🎨 Arayüz
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">{category.name}</h1>

      {products.length ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">Bu kategoride henüz ürün bulunmuyor.</p>
      )}
    </div>
  );
}
