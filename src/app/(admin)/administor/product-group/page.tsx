// app/admin/product-groups/page.tsx

import EditProductGroupForm from "@/components/(backend)/product/EditProductGroupForm";
import AddProductGroupForm from "./AddProductGroupForm";
import { prisma } from "@/lib/prisma";

export default async function ProductGroupPage() {
  const groups: ProductGroup[] = await prisma.productGroup.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
    },
  });

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Ürün Grupları</h1>
      {groups[0] && (
  <EditProductGroupForm
    group={{
      id: groups[0].id,
      name: groups[0].name,
      description: groups[0].description,
      serial: "", // opsiyonel alan
    }}
  />
)}
      <AddProductGroupForm />

      
    </main>
  );
}

interface ProductGroup {
    id: string;
    name: string;
    slug: string;
    description: string;
  }