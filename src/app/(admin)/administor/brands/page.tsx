import { prisma } from "@/lib/prisma";
import { Brand } from "@/types/brand";
import Link from "next/link";

export default async function BrandsPage() {
  const brands:Brand[] = await prisma.brand.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Markalar</h1>
        <Link href="/admin/brands/create" className="bg-orange-500 text-white px-4 py-2 rounded">
          Yeni Marka Ekle
        </Link>
      </div>

      <ul className="space-y-2">
        {brands.map((brand) => (
          <li key={brand.id} className="flex justify-between items-center p-4 border rounded">
            <span>{brand.name}</span>
            <div className="flex gap-2">
              <Link href={`/admin/brands/edit/${brand.id}`} className="text-blue-500">Düzenle</Link>
              <form action={`/admin/brands/delete/${brand.id}`} method="POST">
                <button type="submit" className="text-red-500">Sil</button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
