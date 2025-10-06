import { prisma } from '@/lib/prisma';

// Server Action: Parent ve Children kategorileri çek
export async function getCategories() {
  const categories = await prisma.category.findMany({
    where: { parentId: null }, // üst kategoriler
    include: {
      children: {
        include: {
          children: true // grandchild varsa
        }
      }
    },
    orderBy: { order: 'asc' }
  });

  return categories;
}