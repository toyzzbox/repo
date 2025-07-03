"use server";

import { prisma } from "@/lib/prisma";
import { Product } from "@/types/products";

/**
 * En son eklenen 20 indirimli ürünü getirir.
 * İndirimli ürün = discount > 0 && discount < price
 */
export async function getDiscountedProducts() {
  const products: Product[] = await prisma.product.findMany({
    where: {
      discount: {
        not: null,
        gt: 0
      },
      price: {
        gt: 0
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 20,
    include: {
      medias: true,
      group: true
    }
  });
  
  const validProducts = products.filter(p => p.discount < p.price);

  return products;
}

