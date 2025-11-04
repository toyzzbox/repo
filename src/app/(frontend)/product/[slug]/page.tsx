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
  // 🧮 Görüntülenme sayısını artırarak ürünü getir
  const product = await prisma.product.update({
    where: { slug: params.slug },
    data: {
      views: { increment: 1 },
    },
    include: {
      medias: {
        orderBy: { order: "asc" },
        include: {
          media: {
            include: {
              variants: {
                select: {
                  cdnUrl: true,
                  key: true,
                  format: true,
                  width: true,
                  height: true,
                  type: true,
                },
              },
              tags: {
                select: {
                  name: true,
                  confidence: true,
                  type: true,
                },
              },
            },
          },
        },
      },

      // 🔹 Marka bilgisi
      brands: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },

      // 🔹 Kategori bilgisi (parent dahil)
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

      // 🔹 Ürün grubu ve varyantları
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
              barcode: true,
              medias: {
                orderBy: { order: "asc" },
                include: {
                  media: {
                    include: {
                      variants: {
                        select: {
                          cdnUrl: true,
                          key: true,
                          format: true,
                          type: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },

      // 🔹 Yorumlar ve kullanıcı bilgisi
      comments: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },

      // 🔹 Favori kontrolü için
      favorites: {
        select: { id: true },
      },
    },
  });

  // ❌ Ürün bulunamazsa 404
  if (!product) {
    return notFound();
  }

  // ❤️ Kullanıcının favorisi mi
  const isFavorited = !!product.favorites?.length;

  // 🔁 İlgili ürünleri getir
  const categoryIds = product.categories?.map((cat) => cat.id) || [];
  const relatedProducts =
    categoryIds.length > 0
      ? await getRelatedProducts(product.id, categoryIds)
      : [];

  // 🧩 Sayfa render
  return (
    <ProductDetailsWrapper
      product={product}
      relatedProducts={relatedProducts}
      isFavorited={isFavorited}
      comments={product.comments}
    />
  );
}
