import { prisma } from "@/lib/prisma";
import EditCategoryForm from "@/components/(backend)/category/EditCategoryForm";
import { Category } from "@/types/category";
import { Media } from "@/types/media";

type CategoryWithRelations = Category & {
  medias: Media[];
  parent?: Category | null;
};

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  
  // 1. Kategori + ilişkiler
  const category = await prisma.category.findUnique({
    where: { id: params.id },
    include: {
      medias: true,
      parent: true,
    },
  });

  if (!category) return <div>Kategori bulunamadı.</div>;

  const fullCategory = category as CategoryWithRelations;

  // 2. Tüm kategoriler
  const allCategories = await prisma.category.findMany({
    select: { id: true, name: true },
  });

  // 3. Tüm Medialar (Artık variants üzerinden geliyor)
  const allMedias = await prisma.media.findMany({
    select: {
      id: true,
      variants: {
        select: {
          cdnUrl: true,
          key: true,
          width: true,
          height: true,
          format: true,
        },
      },
    },
  });

  // 4. Forma gönder
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
