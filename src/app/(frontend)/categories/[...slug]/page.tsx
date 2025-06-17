// app/category/[...slug]/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ProductList } from '@/components/(frontend)/product/Product-List';
import { CategoryBreadcrumbs } from '@/components/(frontend)/category/Category-Breadcrumbs';
import { CategoryFilters } from '@/components/(frontend)/category/Category-Filters';

interface Params {
  slug: string[];
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { sort, minPrice, maxPrice, ...filters } = searchParams;
  const slugPath = params.slug.join('/');

  const [category, filteredProducts] = await Promise.all([
    getCategoryWithHierarchy(slugPath),
    getProductsForCategory(slugPath, searchParams),
  ]);

  if (!category) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CategoryBreadcrumbs category={category} />
      <div className="my-6">
        <h1 className="text-3xl font-bold">{category.name}</h1>
        {category.description && (
          <p className="text-gray-600 mt-2">{category.description}</p>
        )}
      </div>
      <CategoryFilters />
      <ProductList
        products={filteredProducts}
        subcategories={category.children}
      />
    </div>
  );
}

async function getCategoryWithHierarchy(slugPath: string) {
  const formattedPath = slugPath.replace(/-/g, '/');
  const slugs = formattedPath.split('/');
  
  // En spesifik kategoriyi bul (son segment)
  const targetSlug = slugs[slugs.length - 1];
  
  const category = await prisma.category.findUnique({
    where: {
      slug: targetSlug
    },
    include: {
      parent: {
        include: {
          parent: true
        }
      },
      children: true
    }
  });

  // Kategori hiyerarşisini doğrula
  if (slugs.length > 1) {
    let current = category;
    for (let i = slugs.length - 2; i >= 0; i--) {
      if (!current?.parent || current.parent.slug !== slugs[i]) {
        return null;
      }
      current = current.parent;
    }
  }

  return category;
}

async function getProductsForCategory(slugPath: string, filters: any) {
  const formattedPath = slugPath.replace(/-/g, '/');
  const slugs = formattedPath.split('/');
  const targetSlug = slugs[slugs.length - 1];

  // CTE (Common Table Expression) kullanarak alt kategorileri getir
  const categoryIds = await prisma.$queryRaw<{id: string}[]>`
    WITH RECURSIVE category_tree AS (
      -- Base case: hedef kategori
      SELECT id, "parentId", slug
      FROM "Category"
      WHERE slug = ${targetSlug}
      
      UNION ALL
      
      -- Recursive case: alt kategoriler
      SELECT c.id, c."parentId", c.slug
      FROM "Category" c
      INNER JOIN category_tree ct ON c."parentId" = ct.id
    )
    SELECT id FROM category_tree
  `;

  if (categoryIds.length === 0) return [];

  const ids = categoryIds.map(cat => cat.id);

  // Ürünleri getir (bu kategori ve alt kategorilerine bağlı olanlar)
  return await prisma.product.findMany({
    where: {
      categories: {
        some: {
          id: {
            in: ids
          }
        }
      },
      price: {
        gte: filters.minPrice ? Number(filters.minPrice) : undefined,
        lte: filters.maxPrice ? Number(filters.maxPrice) : undefined,
      },
    },
    include: {
      medias: true,
      categories: {
        select: {
          id: true,
          name: true,
          slug: true
        }
      }
    },
    orderBy: getOrderBy(filters.sort),
  });
}

function getOrderBy(sort?: string | string[]) {
  const sortValue = Array.isArray(sort) ? sort[0] : sort;
  
  switch (sortValue) {
    case 'price-asc':
      return { price: 'asc' };
    case 'price-desc':
      return { price: 'desc' };
    case 'newest':
      return { createdAt: 'desc' };
    default:
      return { name: 'asc' };
  }
}