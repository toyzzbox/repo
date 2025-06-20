// app/admin/product-groups/page.tsx

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