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
    getValidatedCategory(slugPath),
    getValidatedProducts(slugPath, searchParams),
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

async function getValidatedCategory(slugPath: string) {
  const formattedPath = slugPath.replace(/-/g, '/');
  const slugs = formattedPath.split('/');

  // Hiyerarşik kategori doğrulama
  const category = await prisma.category.findFirst({
    where: {
      slug: slugs[slugs.length - 1],
      AND: [
        ...(slugs.length > 1 ? [{
          parent: {
            slug: slugs[slugs.length - 2],
            ...(slugs.length > 2 ? {
              parent: {
                slug: slugs[slugs.length - 3]
              }
            } : {})
          }
        }] : [])
      ]
    },
    include: {
      parent: {
        include: {
          parent: slugs.length > 2
        }
      },
      children: true
    }
  });

  return category;
}

async function getValidatedProducts(slugPath: string, filters: any) {
  const formattedPath = slugPath.replace(/-/g, '/');
  const slugs = formattedPath.split('/');

  // 1. Önce kategori hiyerarşisini doğrula
  const category = await prisma.category.findFirst({
    where: {
      slug: slugs[slugs.length - 1],
      AND: [
        ...(slugs.length > 1 ? [{
          parent: {
            slug: slugs[slugs.length - 2]
          }
        }] : [])
      ]
    }
  });

  if (!category) return [];

  // 2. Doğrulanmış kategoriye ait ürünleri getir
  return await prisma.product.findMany({
    where: {
      categories: {
        some: {
          id: category.id
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