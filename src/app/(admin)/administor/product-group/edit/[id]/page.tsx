import EditProductGroupForm from "@/components/(backend)/product/EditProductGroupForm";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductGroupPage({ params }: PageProps) {
  const { id } = await params;

  const group = await prisma.productGroup.findUnique({
    where: { id },
  });

  if (!group) {
    return <div>Ürün grubu bulunamadı.</div>;
  }

  return (
    <EditProductGroupForm
      group={{
        id: group.id,
        name: group.name,
        description: group.description ?? "",
        serial: group.serial ?? "",
      }}
    />
  );
}
