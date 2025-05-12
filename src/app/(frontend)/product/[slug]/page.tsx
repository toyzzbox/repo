
import ProductDetails from "@/components/(frontend)/product/ProductDetails";
import { prisma } from "@/lib/prisma";


export default async function ProductPage({ params }: { params: { slug: string } }) {
  // params'ı doğrudan kullanıyoruz
  const { slug } = params;

  // Ürünü veritabanından alıyoruz
  const product = await prisma.product.findUnique({
    where: {
      slug: slug,
    },
    select: {
      id: true,
      slug: true, // Slug'u da seçiyoruz
      name: true,
      description: true,
      price: true,
     
    },
  });

  // Ürün bulunamazsa hata mesajı döndürüyoruz
  if (!product) {
    return <div>Product not found</div>;
  }

  // Ürünü ProductDetails bileşenine geçiriyoruz
  return <ProductDetails product={product} />;
}
