'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from './auth';

export async function getUserOrders() {
  const session = await getCurrentUser();

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  return orders;
}
