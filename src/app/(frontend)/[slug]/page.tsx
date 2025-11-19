import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Prisma } from "@prisma/client";
import ProductDetailsWrapper from "@/components/(frontend)/product/ProductDetailsWrapper";
import { getRelatedProducts } from "@/actions/getRelatedProducts";
import SortSelect from "@/components/(frontend)/category/SortSelect";
import CategoryFilters from "@/components/(frontend)/category/CategoryFilters";
import { ProductCard } from "@/components/(frontend)/product/ProductCard";
import MobileFilterButton from "../category/MobileFilterButton";

/* ----------- Tip & Yardımcı ----------- */
type DeepCategory = Prisma.CategoryGetPayload<{
  include: { children: { include: { children: { include: { children: true } } } } };
}>;

const collectCategoryIds = (c: DeepCategory): string[] => [
  c.id,
  ...c.children.flatMap(collectCategoryIds),
];

/* ==========================================
   DİNAMİK ÜRÜN / KATEGORİ SAYFASI
========================================== */
export default async function DynamicPage({ params, searchParams = {} }: PageProps) {
  const { slug } = await params;

  // Ürün ve kategori sorgularını paralel çalıştır
  const [productResult, categoryResult] = await Promise.allSettled([
    prisma.product.findUnique({
      where: { slug },
      include: {
        medias: {
          orderBy: { order: "asc" },
          include: {
            media: {
              include: {
                files: {
                  select: {
                    url: true,
                    width: true,
                    height: true,
                    format: true,
                  },
                },
                variants: {
                  select: {
                    cdnUrl: true,
                    key: true,
                    format: true,
                    width: true,
                    height: true,
                    type: true,
                  },
                },
              },
            },
          },
        },
        brands: {
          select: { id: true, name: true, slug: true },
        },
        categories: {
          select: {
            id: true,
            name: true,
            slug: true,
            parent: { select: { id: true, name: true, slug: true } },
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
                      include: {
                        files: {
                          select: {
                            url: true,
                            width: true,
                            height: true,
                            format: true,
                          },
                        },
                        variants: {
                          select: {
                            cdnUrl: true,
                            key: true,
                            format: true,
                            type: true,
                          },
                        },
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

    prisma.category.findUnique({
      where: { slug },
      include: {
        children: { include: { children: { include: { children: true } } } },
      },
    }),
  ]);

  const product =
    productResult.status === "fulfilled" ? productResult.value : null;
  const category =
    categoryResult.status === "fulfilled" ? categoryResult.value : null;

  /* ========== ÜRÜN SAYFASI ========== */
  if (product) {
    if (!product.isActive) notFound();

    // Görüntülenme sayısını arka planda artır
    prisma.product
      .update({
        where: { id: product.id },
        data: { views: { increment: 1 } },
      })
      .catch(() => {});

    const categoryIds = product.categories?.map((cat) => cat.id) || [];
    const relatedProducts =
      categoryIds.length > 0
        ? await getRelatedProducts(product.id, categoryIds)
        : [];

    return (
      <ProductDetailsWrapper
        product={product}
        isFavorited={false}
        relatedProducts={relatedProducts}
        comments={product.comments}
      />
    );
  }

  /* ========== KATEGORİ SAYFASI ========== */
  if (category) {
    const categoryIds = collectCategoryIds(category);

    const arr = (v: unknown) =>
      (Array.isArray(v) ? v : v ? [v] : []) as string[];
    const selectedCatIds = arr(searchParams.category);
    const selectedBrands = arr(searchParams.brand);
    const selectedAttrIds = arr(searchParams.attribute);

    const minPrice = Number(searchParams.minPrice) || undefined;
    const maxPrice = Number(searchParams.maxPrice) || undefined;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      categories: {
        some: {
          id: { in: selectedCatIds.length ? selectedCatIds : categoryIds },
        },
      },
      ...(selectedBrands.length && {
        brands: { some: { slug: { in: selectedBrands } } },
      }),
      ...(selectedAttrIds.length && {
        attributes: { some: { id: { in: selectedAttrIds } } },
      }),
      ...(minPrice || maxPrice
        ? {
            price: {
              ...(minPrice && { gte: minPrice }),
              ...(maxPrice && { lte: maxPrice }),
            },
          }
        : {}),
    };

    const products = await prisma.product.findMany({
      where,
      orderBy:
        sort === "price_asc"
          ? { price: "asc" }
          : sort === "price_desc"
          ? { price: "desc" }
          : sort === "name_asc"
          ? { name: "asc" }
          : sort === "name_desc"
          ? { name: "desc" }
          : { createdAt: "desc" },

      select: {
        id: true,
        slug: true,
        name: true,
        price: true,
        medias: {
          include: {
            media: {
              include: {
                files: {
                  select: {
                    url: true,
                    width: true,
                    height: true,
                    format: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">{category.name}</h1>
        ...
      </div>
    );
  }

  notFound();
}
