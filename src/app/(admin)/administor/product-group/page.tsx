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

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Mevcut Gruplar</h2>
        <ul className="border rounded divide-y">
          {groups.map((group) => (
            <li key={group.id} className="p-3">
              <span>{group.name}</span>{" "}
              <span className="text-gray-400 text-sm">({group.slug})</span>
              <span>{group.description}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

interface ProductGroup {
    id: string;
    name: string;
    slug: string;
    description: string;
  }