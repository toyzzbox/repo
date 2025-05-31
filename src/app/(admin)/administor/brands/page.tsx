import { prisma } from "@/lib/prisma";

import Link from "next/link";
import BrandsTable from "./BrandTable";

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Markalar</h1>
        <Link href="/admin/brands/create" className="bg-orange-500 text-white px-4 py-2 rounded">
          Yeni Marka Ekle
        </Link>
      </div>

      <BrandsTable brands={brands} />
    </div>
  );
}
