import CategoriesTable from "@/components/(backend)/category/CategoryTable";
import { prisma } from "@/lib/prisma";

import Link from "next/link";


export default async function ProductsPage() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Ürünler</h1>
        <Link href="/admin/categories/create" className="bg-orange-500 text-white px-4 py-2 rounded">
          Yeni Kategori Ekle
        </Link>
      </div>

      <CategoriesTable categories={categories} />
    </div>
  );
}
