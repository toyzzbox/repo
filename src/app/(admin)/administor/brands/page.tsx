import { Suspense } from "react";
import { prisma } from "@/lib/prisma";

import Link from "next/link";
import BrandsTable from "./BrandTable";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SafeBrand = {
  id: string;
  name: string;
  slug: string;
  createdAt: string | null;
};

export default async function BrandsPage() {
  let brands: SafeBrand[] = [];

  try {
    const rows = await prisma.brand.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
      },
    });

    brands = rows.map((b) => ({
      id: b.id,
      name: b.name,
      slug: b.slug,
      createdAt: b.createdAt ? b.createdAt.toISOString() : null,
    }));
  } catch (e) {
    console.error("Brands fetch failed:", e);
    brands = [];
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Markalar</h1>

        {/* Senin route'un /administor/... gibi görünüyor; link'i ona göre düzelt */}
        <Link
          href="/administor/brands/create"
          className="bg-orange-500 text-white px-4 py-2 rounded"
        >
          Yeni Marka Ekle
        </Link>
      </div>

      <Suspense fallback={null}>
        <BrandsTable brands={brands} />
      </Suspense>
    </div>
  );
}
