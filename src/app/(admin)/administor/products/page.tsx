import ProductsTable from "@/components/(backend)/product/ProductTable";
import { prisma } from "@/lib/prisma";

import Link from "next/link";


export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Ürünler</h1>
        <Link href="/admin/brands/create" className="bg-orange-500 text-white px-4 py-2 rounded">
          Yeni Ürün Ekle
        </Link>
      </div>

      <ProductsTable products={products} />
    </div>
  );
}
