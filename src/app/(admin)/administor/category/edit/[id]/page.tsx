import { prisma } from "@/lib/prisma";
import EditCategoryForm from "@/components/(backend)/category/EditCategoryForm";
import { Category } from "@/types/category";
import { Media } from "@/types/media";

type CategoryWithRelations = Category & {
  medias: Media[];
  parent?: Category | null;
};

export default async function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  // 1. Kategoriyi ilişkili verileriyle birlikte getir
  const category = await prisma.category.findUnique({
    where: { id: params.id },
    include: {
      medias: true,
      parent: true,
    },
  });

  if (!category) {
    return <div>Kategori bulunamadı.</div>;
  }

  const fullCategory = category as CategoryWithRelations;

  // 2. Tüm kategorileri üst kategori seçimi için al
  const allCategories = await prisma.category.findMany({
    select: { id: true, name: true },
  });

  // 3. Tüm medya kayıtlarını getir (name yoksa urls kullanılmalı!)
  const allMedias = await prisma.media.findMany({
    select: { id: true, urls: true }, // ✅ "name" yerine "urls"
  });

  // 4. Form bileşenine verileri aktar
  return (
    <EditCategoryForm
      category={{
        id: fullCategory.id,
        name: fullCategory.name,
        slug: fullCategory.slug,
        description: fullCategory.description ?? "",
        parentId: fullCategory.parent?.id ?? "",
        mediaIds: fullCategory.medias.map((m) => m.id),
      }}
      allCategories={allCategories}
      medias={allMedias}
    />
  );
}
