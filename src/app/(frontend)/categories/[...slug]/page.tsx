// src/app/categories/[...slug]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface Props {
  params: { slug: string[] };
}

export default async function CategoryPage({ params }: Props) {
  const slugSegments = params.slug;

  if (!slugSegments || slugSegments.length === 0) return notFound();

  const currentSlug = slugSegments.at(-1)!;

  // 🔍 Slug'a göre mevcut kategoriyi bul
  const category = await prisma.category.findUnique({
    where: { slug: currentSlug },
    include: {
      children: true,
      parent: {
        include: { parent: true }, // istersen parent zincirini al
      },
    },
  });

  if (!category) return notFound();

  // ✅ Kategori bulunduysa göster
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{category.name}</h1>
      <p className="text-gray-600">{category.description}</p>

      <h2 className="text-xl mt-6 mb-2 font-semibold">Alt Kategoriler</h2>
      <ul className="list-disc ml-6">
        {category.children.map((child) => (
          <li key={child.id}>{child.name}</li>
        ))}
      </ul>
    </div>
  );
}
