import { prisma } from '@/lib/prisma';

// Server Action: Parent ve Children kategorileri çek
export async function getCategories() {

const categories = await prisma.category.findMany({
  where: { parentId: null },
  include: {
    children: {
      include: {
        children: true
      }
    }
  },
  select: {
    id: true,
    name: true,
    slug: true,
    order: true,
    children: {
      select: {
        id: true,
        name: true,
        slug: true,
        children: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    }
  },
  orderBy: { order: 'asc' }
});
}