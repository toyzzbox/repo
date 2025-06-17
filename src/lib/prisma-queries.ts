import { prisma } from './prisma';

// Kategori ve tüm alt kategorilerinin ID'lerini recursive olarak getiren fonksiyon
export async function getAllCategoryIds(categorySlug: string): Promise<string[]> {
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    select: { id: true }
  });

  if (!category) return [];

  const categoryIds = [category.id];
  
  // Alt kategorileri recursive olarak getir
  const getChildrenIds = async (parentId: string): Promise<string[]> => {
    const children = await prisma.category.findMany({
      where: { parentId },
      select: { id: true }
    });

    let allIds: string[] = [];
    
    for (const child of children) {
      allIds.push(child.id);
      // Her alt kategori için de recursive çağrı yap
      const grandChildren = await getChildrenIds(child.id);
      allIds = [...allIds, ...grandChildren];
    }
    
    return allIds;
  };

  const childrenIds = await getChildrenIds(category.id);
  return [...categoryIds, ...childrenIds];
}

// Kategori bilgilerini ve ürünlerini getiren fonksiyon
export async function getCategoryWithProducts(categorySlug: string) {
  // Önce kategoriyi getir
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    include: {
      medias: true,
      children: {
        select: {
          id: true,
          name: true,
          slug: true,
          description: true
        }
      }
    }
  });

  if (!category) return null;

  // Tüm kategori ID'lerini getir (ana kategori + alt kategoriler)
  const allCategoryIds = await getAllCategoryIds(categorySlug);

  // Bu kategorilerdeki tüm ürünleri getir
  const products = await prisma.product.findMany({
    where: {
      categories: {
        some: {
          id: {
            in: allCategoryIds
          }
        }
      }
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
    orderBy: {
      createdAt: 'desc'
    }
  });

  return {
    category,
    products,
    totalProducts: products.length
  };
}