import { Suspense } from "react";
import CategoriesTable from "@/components/(backend)/category/CategoryTable";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CategoriesPage() {
  let categories: any[] = [];

  try {
    categories = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    console.error("Categories fetch failed:", e);
    categories = [];
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Kategoriler</h1>

        <Link
          href="/administor/categories/create"
          className="bg-orange-500 text-white px-4 py-2 rounded"
        >
          Yeni Kategori Ekle
        </Link>
      </div>

      <Suspense fallback={null}>
        <CategoriesTable categories={categories} />
      </Suspense>
    </div>
  );
}
