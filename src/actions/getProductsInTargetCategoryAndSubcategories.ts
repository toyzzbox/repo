import { prisma } from "@/lib/prisma";
import { VariantType } from "@prisma/client";

/**
 * Belirtilen slug'a sahip bir kategori ve onun tüm alt kategorilerindeki ürünleri getirir.
 */
export async function getProductsInTargetCategoryAndSubcategories(
  targetCategorySlug: string,
  filters: {
    minPrice?: string | number;
    maxPrice?: string | number;
    sort?: string | string[];
  } = {}
) {
  // 0 girilirse de çalışsın diye !== undefined kullandım
  const minPrice = filters.minPrice !== undefined ? Number(filters.minPrice) : undefined;
  const maxPrice = filters.maxPrice !== undefined ? Number(filters.maxPrice) : undefined;

  const categoryIds = await prisma.$queryRaw<{ id: string }[]>`
    WITH RECURSIVE CategoryTree AS (
      SELECT id, "parentId"
      FROM "Category"
      WHERE slug = ${targetCategorySlug}

      UNION ALL

      SELECT c.id, c."parentId"
      FROM "Category" c
      INNER JOIN CategoryTree ct ON c."parentId" = ct.id
    )
    SELECT id FROM CategoryTree;
  `;

  if (categoryIds.length === 0) return [];

  const idsToFilter = categoryIds.map((cat) => cat.id);

  const products = await prisma.product.findMany({
    where: {
      categories: {
        some: {
          id: { in: idsToFilter },
        },
      },
      price: {
        gte: minPrice,
        lte: maxPrice,
      },
      isActive: true,
    },
    include: {
      // ✅ Yeni medya sistemi: ProductMedia -> Media -> Variants
      medias: {
        orderBy: { order: "asc" },
        include: {
          media: {
            select: {
              id: true,
              variants: {
                where: { type: VariantType.ORIGINAL }, // istersen WEBP yap
                select: { cdnUrl: true, key: true, type: true },
                take: 1,
              },
            },
          },
        },
      },

      brands: true,

      categories: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    orderBy: getOrderBy(filters.sort),
  });

  return products;
}

function getOrderBy(sort?: string | string[]) {
  const sortValue = Array.isArray(sort) ? sort[0] : sort;

  switch (sortValue) {
    case "price-asc":
      return { price: "asc" as const };
    case "price-desc":
      return { price: "desc" as const };
    case "newest":
      return { createdAt: "desc" as const };
    default:
      return { name: "asc" as const };
  }
}
