"use client";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
};

interface CategoryTreeProps {
  categories: Category[];
  parentId?: string | null;
  level?: number;
}

export default function CategoryTree({
  categories,
  parentId = null,
  level = 0,
}: CategoryTreeProps) {
  const router = useRouter();

  const filtered = categories.filter(c => c.parentId === parentId);

  if (filtered.length === 0) return null;

  return (
    <ul className={`pl-${level * 4}`}>
      {filtered.map((category) => (
        <li key={category.id}>
          <div
            className="flex justify-between items-center p-2 border-b cursor-pointer"
            onClick={() => router.push(`/category/${category.slug}`)}
          >
            <span>{category.name}</span>
            <ChevronRight size={16} />
          </div>

          {/* 🔄 Recursive render */}
          <CategoryTree
            categories={categories}
            parentId={category.id}
            level={level + 1}
          />
        </li>
      ))}
    </ul>
  );
}
