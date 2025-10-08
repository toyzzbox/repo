import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Prisma } from "@prisma/client";
import ProductDetailsWrapper from "@/components/(frontend)/product/ProductDetailsWrapper";
import { getRelatedProducts } from "@/actions/getRelatedProducts";
import SortSelect from "@/components/(frontend)/category/SortSelect";
import CategoryFilters from "@/components/(frontend)/category/CategoryFilters";
import { ProductCard } from "@/components/(frontend)/product/ProductCard";
import MobileFilterButton from "@/components/(frontend)/category/MobileFilterButton";

type PageProps = {
  params: { slug: string };
  searchParams?: { [k: string]: string | string[] | undefined };
};

/* ----------- tip & yardımcı ----------- */
type DeepCategory = Prisma.CategoryGetPayload<{
  include: { children: { include: { children: { include: { children: true } } } } };
}>;

const collectCategoryIds = (c: DeepCategory): string[] => [
  c.id,
  ...c.children.flatMap(collectCategoryIds),
];

export default async function DynamicPage({ params, searchParams = {} }: PageProps) {
  const { slug } = params;

  // Paralel sorgular: Hem ürün hem kategori sorgusunu aynı anda yap
  const [product, category] = await Promise.all([
    // ÜRÜN SORGUSU
    prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        medias: {
          orderBy: { order: "asc" },
          include: {
            media: {
              select: {
                urls: true,
              },
            },
          },
        },
        brands: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        categories: {
          select: {
            id: true,
            name: true,
            slug: true,
            parent: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        group: {
          include: {
            products: {
              select: {
                id: true,
                slug: true,
                name: true,
                price: true,
                description: true,
                stock: true,
                barcode: true,
                medias: {
                  orderBy: { order: "asc" },
                  include: {
                    media: {
                      select: {
                        urls: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        comments: {
          include: {
            user: { select: { name: true, image: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    }),

    // KATEGORİ SORGUSU
    prisma.category.findUnique({
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
    }),
  ]);

  /* ========== ÜRÜN SAYFASI ========== */
  if (product) {
    // View sayısını artır (arka planda, blocking değil)
    prisma.product
      .update({
        where: { id: product.id },
        data: { views: { increment: 1 } },
      })
      .catch(() => {});

    const isFavorited = !!product.favorites?.length;
    const categoryIds = product.categories?.map((cat) => cat.id) || [];
    const relatedProducts = categoryIds.length
      ? await getRelatedProducts(product.id, categoryIds)
      : [];

    return (
      <ProductDetailsWrapper
        product={product}
        isFavorited={isFavorited}
        relatedProducts={relatedProducts}
        comments={product.comments}
      />
    );
  }

  /* ========== KATEGORİ SAYFASI ========== */
  if (category) {
    const categoryIds = collectCategoryIds(category);

    /* URL'den filtreleri al */
    const arr = (v: unknown) => (Array.isArray(v) ? v : v ? [v] : []) as string[];
    const selectedCatIds = arr(searchParams.category);
    const selectedBrands = arr(searchParams.brand);
    const selectedAttrIds = arr(searchParams.attribute);

    const minPrice = Number(searchParams.minPrice) || undefined;
    const maxPrice = Number(searchParams.maxPrice) || undefined;

    /* Alt kategoriler */
    const subcategories = await prisma.category.findMany({
      where: { parentId: category.id },
      select: { id: true, name: true, slug: true, _count: { select: { products: true } } },
    });

    /* İlgili markalar */
    const brands = await prisma.brand.findMany({
      where: {
        products: {
          some: { categories: { some: { id: { in: categoryIds } } } },
        },
      },
      select: { slug: true, name: true },
      orderBy: { name: "asc" },
    });

    /* Attribute grupları */
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

    /* Sıralama */
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

    /* WHERE koşulu */
    const where: Prisma.ProductWhereInput = {
      isActive: true,
      categories: {
        some: {
          id: { in: selectedCatIds.length ? selectedCatIds : categoryIds },
        },
      },
    };
    if (selectedBrands.length) where.brands = { some: { slug: { in: selectedBrands } } };
    if (selectedAttrIds.length) where.attributes = { some: { id: { in: selectedAttrIds } } };
    if (minPrice || maxPrice)
      where.price = {
        ...(minPrice && { gte: minPrice }),
        ...(maxPrice && { lte: maxPrice }),
      };

    /* Ürünleri getir */
    const products = await prisma.product.findMany({
      where,
      orderBy,
      select: {
        id: true,
        slug: true,
        name: true,
        price: true,
        medias: {
          include: {
            media: {
              select: {
                urls: true,
              },
            },
          },
        },
      },
    });

    /* KATEGORİ UI */
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
          <div className="hidden lg:block">
            <CategoryFilters
              subcategories={subcategories}
              brands={brands}
              attributeGroups={attributeGroups}
            />
          </div>

          {products.length ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-start">
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

  /* ========== 404 ========== */
  notFound();
}