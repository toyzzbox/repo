import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getRelatedProducts } from "@/actions/getRelatedProducts";
import ProductDetailsWrapper from "@/components/(frontend)/product/ProductDetailsWrapper";
import { notFound } from "next/navigation";

type PageProps = {
  params: {
    slug: string;
  };
};

export default async function ProductPage({ params }: PageProps) {
  const session = await auth(); // 🔐 Kullanıcı oturumu

  const product = await prisma.product.update({
    where: { slug: params.slug },
    data: {
      views: {
        increment: 1,
      },
    },
    include: {
        medias: {
          orderBy: { order: "asc" },
          include: {
            media: {
              select: {
                urls: true,
              },
            },
          },
        },
        brands: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        categories: {
          select: {
            id: true,
            name: true,
            slug: true,
            parent: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        group: {
          include: {
            products: {
              select: {
                id: true,
                slug: true,
                name: true,
                price: true,
                description: true,
                stock: true,
                medias: {
                  orderBy: { order: "asc" },
                  include: {
                    media: {
                      select: {
                        urls: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        favorites: session?.user?.id
          ? {
              where: { userId: session.user.id },
              select: { id: true },
            }
          : undefined,
        comments: {
          include: {
            user: { select: { name: true, image: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      }
   
  });

  if (!product) {
    return notFound();
  }

  const isFavorited = !!product.favorites?.length;

  const categoryIds = product.categories?.map((cat) => cat.id) || [];
  const relatedProducts = categoryIds.length
    ? await getRelatedProducts(product.id, categoryIds)
    : [];

  return (
    <ProductDetailsWrapper
      product={product}
      isFavorited={isFavorited}
      relatedProducts={relatedProducts}
      comments={product.comments}
    />
  );
}

export async function generateStaticParams() {
    const products = await prisma.product.findMany({
      select: { slug: true },
      where: { isPublished: true }, // yayında olmayan ürünleri filtrele
    });
  
    return products.map((product) => ({
      slug: product.slug,
    }));
  }