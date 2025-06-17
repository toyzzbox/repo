// components/category-breadcrumbs.tsx
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { Category } from '@prisma/client';

interface CategoryBreadcrumbsProps {
  category: Category & {
    parent: Category | null;
  };
}

export function CategoryBreadcrumbs({ category }: CategoryBreadcrumbsProps) {
  // Kategori hiyerarşisini oluştur
  const buildBreadcrumbs = () => {
    const breadcrumbs = [];
    let currentCategory: any = category;

    while (currentCategory) {
      breadcrumbs.unshift(currentCategory);
      currentCategory = currentCategory.parent;
    }

    return breadcrumbs;
  };

  const breadcrumbs = buildBreadcrumbs();

  return (
    <nav className="flex items-center text-sm mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            Ana Sayfa
          </Link>
        </li>
        {breadcrumbs.map((item, index) => (
          <li key={item.id} className="flex items-center">
            <ChevronRight className="h-4 w-4 text-gray-400" />
            {index === breadcrumbs.length - 1 ? (
              <span className="ml-2 font-medium text-gray-700">
                {item.name}
              </span>
            ) : (
              <Link
                href={`/category/${item.slug}`}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}