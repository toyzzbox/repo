// src/app/brands/page.tsx
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Markalar",
};

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      medias: {
        select: { urls: true },
        take: 1, // sadece ilk medya yeterli
      },
    },
  });

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Markalar</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {brands.map((brand) => {
    
          const logo = brand.medias?.[0]?.urls?.[0] || "/placeholder.png";

          return (
            <Link
              key={brand.id}
              href={`/brands/${brand.slug}`}
              className="border rounded-lg p-4 hover:shadow-md flex flex-col items-center transition"
            >
              <div className="w-20 h-20 relative mb-2">
                <Image
                  src={logo}
                  alt={brand.name}
                  fill
                  className="object-contain"
                  sizes="80px"
                />
              </div>
              <span className="text-sm font-medium text-center">{brand.name}</span>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
