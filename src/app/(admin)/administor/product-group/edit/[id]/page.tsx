import EditProductGroupForm from "@/components/(backend)/product/EditProductGroupForm";
import { prisma } from "@/lib/prisma";

interface Props {
  params: {
    id: string;
  };
}

export default async function EditProductGroupPage({ params }: Props) {
  const group = await prisma.productGroup.findUnique({
    where: { id: params.id },
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
