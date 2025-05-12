import ProductDetails from "@/components/(frontend)/product/ProductDetails";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      price: true,
    },
  });

  if (!product) {
    return <div>Product not found</div>;
  }

  return <ProductDetails product={product} />;
}
