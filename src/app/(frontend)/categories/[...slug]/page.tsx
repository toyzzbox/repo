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
    getCategory(slugPath),
    getFilteredProducts(slugPath, searchParams),
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

async function getCategory(slugPath: string) {
  // URL'deki tireleri slash ile değiştir
  const formattedPath = slugPath.replace(/-/g, '/');
  const slugs = formattedPath.split('/');
  const lastSlug = slugs[slugs.length - 1];
  
  // Önce ana kategoriyi bul
  const parentCategory = await prisma.category.findFirst({
    where: { slug: slugs[0] },
    include: {
      children: true,
    },
  });

  if (!parentCategory) return null;

  // Eğer alt kategori varsa onu bul
  if (slugs.length > 1) {
    const childCategory = parentCategory.children.find(child => child.slug === lastSlug);
    if (childCategory) {
      return await prisma.category.findUnique({
        where: { id: childCategory.id },
        include: {
          parent: true,
          children: true,
        },
      });
    }
  }

  // Alt kategori yoksa ana kategoriyi döndür
  return parentCategory;
}

async function getFilteredProducts(slugPath: string, filters: any) {
  // URL'deki tireleri slash ile değiştir
  const formattedPath = slugPath.replace(/-/g, '/');
  const slugs = formattedPath.split('/');
  const lastSlug = slugs[slugs.length - 1];
  
  // Önce ana kategoriyi bul
  const parentCategory = await prisma.category.findFirst({
    where: { slug: slugs[0] },
    include: {
      children: true,
    },
  });

  if (!parentCategory) return [];

  let categoryId = parentCategory.id;

  // Eğer alt kategori varsa onun ID'sini kullan
  if (slugs.length > 1) {
    const childCategory = parentCategory.children.find(child => child.slug === lastSlug);
    if (childCategory) {
      categoryId = childCategory.id;
    }
  }

  return await prisma.product.findMany({
    where: {
      categories: {
        some: {
          id: categoryId
        }
      },
      price: {
        gte: filters.minPrice ? Number(filters.minPrice) : undefined,
        lte: filters.maxPrice ? Number(filters.maxPrice) : undefined,
      },
    },
    include: {
      medias: true,
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