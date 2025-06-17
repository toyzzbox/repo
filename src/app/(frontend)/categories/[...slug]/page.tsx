import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ProductList } from '@/components/(frontend)/product/Product-List';
import { CategoryBreadcrumbs } from '@/components/(frontend)/category/Category-Breadcrumbs';
import { CategoryFilters } from '@/components/(frontend)/category/Category-Filters';

// Types
interface CategoryWithHierarchy {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent?: CategoryWithHierarchy;
  children?: CategoryWithHierarchy[];
  _count?: {
    products: number;
  };
}

interface ProductWithRelations {
  id: string;
  name: string;
  slug: string;
  price: number;
  medias: {
    id: string;
    url: string;
    alt?: string;
  }[];
  categories: {
    id: string;
    name: string;
    slug: string;
  }[];
  brands?: {
    id: string;
    name: string;
  }[];
}

// Data Fetching
async function getProductsInCategoryTree(
  targetCategorySlug: string,
  filters: {
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
  } = {}
) {
  // Get all category IDs in the tree (including subcategories)
  const categoryIds = await prisma.$queryRaw<{ id: string }[]>`
    WITH RECURSIVE CategoryTree AS (
      SELECT id FROM "Category" WHERE slug = ${targetCategorySlug}
      UNION ALL
      SELECT c.id FROM "Category" c
      JOIN CategoryTree ct ON c."parentId" = ct.id
    )
    SELECT id FROM CategoryTree
  `;

  if (!categoryIds.length) return [];

  return await prisma.product.findMany({
    where: {
      categories: { some: { id: { in: categoryIds.map(c => c.id) } } },
      price: { gte: filters.minPrice, lte: filters.maxPrice },
      isActive: true,
    },
    include: {
      medias: true,
      brands: true,
      categories: { select: { id: string, name: true, slug: true } },
    },
    orderBy: getOrderBy(filters.sort),
  });
}

async function getCategoryWithHierarchy(slugPath: string): Promise<CategoryWithHierarchy | null> {
  const targetSlug = slugPath.split('/').pop()!;

  const category = await prisma.category.findUnique({
    where: { slug: targetSlug },
    include: {
      parent: {
        include: {
          parent: true, // 2 levels up
        },
      },
      children: {
        include: {
          _count: { select: { products: true } }, // Product counts for subcategories
          children: { // 2 levels down
            include: {
              _count: { select: { products: true } },
            orderBy: { name: 'asc' },
          },
        },
        orderBy: { name: 'asc' },
      },
      _count: { select: { products: true } },
    },
  });

  if (!category) return null;

  // Verify slug path hierarchy
  const slugs = slugPath.split('/');
  let current: any = category;
  for (let i = slugs.length - 2; i >= 0; i--) {
    if (!current?.parent || current.parent.slug !== slugs[i]) return null;
    current = current.parent;
  }

  return category;
}

function getOrderBy(sort?: string | string[]) {
  const sortValue = Array.isArray(sort) ? sort[0] : sort;
  switch (sortValue) {
    case 'price-asc': return { price: 'asc' };
    case 'price-desc': return { price: 'desc' };
    case 'newest': return { createdAt: 'desc' };
    default: return { name: 'asc' };
  }
}

// Page Component
export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string[] };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const slugPath = params.slug.join('/');
  const targetSlug = params.slug[params.slug.length - 1];
  
  const { sort, minPrice, maxPrice, ...filters } = searchParams;
  const numericMinPrice = minPrice ? Number(minPrice) : undefined;
  const numericMaxPrice = maxPrice ? Number(maxPrice) : undefined;

  const [category, products] = await Promise.all([
    getCategoryWithHierarchy(slugPath),
    getProductsInCategoryTree(targetSlug, {
      sort: sort?.toString(),
      minPrice: numericMinPrice,
      maxPrice: numericMaxPrice,
    }),
  ]);

  if (!category) return notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <CategoryBreadcrumbs category={category} />
      
      <div className="my-6">
        <h1 className="text-3xl font-bold">{category.name}</h1>
        {category.description && (
          <p className="text-gray-600 mt-2">{category.description}</p>
        )}
        {category._count?.products && (
          <p className="text-sm text-gray-500 mt-1">
            {category._count.products} ürün
          </p>
        )}
      </div>

      <CategoryFilters />

      {/* Subcategories Section */}
      {category.children && category.children.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Alt Kategoriler</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {category.children.map((subcategory) => (
              <Link
                key={subcategory.id}
                href={`/category/${slugPath}/${subcategory.slug}`}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-medium">{subcategory.name}</h3>
                {subcategory._count?.products && (
                  <p className="text-sm text-gray-500 mt-1">
                    {subcategory._count.products} ürün
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Products Section */}
      <section>
        {products.length > 0 ? (
          <ProductList 
            products={products} 
            subcategories={category.children || []} 
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Bu kategoride henüz ürün bulunmamaktadır.</p>
            {category.children?.length ? (
              <p className="mt-2">
                Alt kategorileri incelemek ister misiniz?
              </p>
            ) : null}
          </div>
        )}
      </section>
    </div>
  );
}