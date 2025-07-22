'use client';

import Link from "next/link";

interface CategoryInfo {
  slug: string;
  name: string;
}

interface ProductBreadcrumbProps {
  parentCategory?: CategoryInfo;
  category?: CategoryInfo;
  groupName?: string;
  productName: string;
}

export default function ProductBreadcrumb({
  parentCategory,
  category,
  groupName,
  productName,
}: ProductBreadcrumbProps) {
  return (
    <nav className="py-2 px-4 text-sm text-gray-600" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center">

        {/* Parent kategori */}
        {parentCategory && (
          <>
            <li>
              <Link
                href={`/categories/${parentCategory.slug}`}
                className="hover:text-gray-800"
              >
                {parentCategory.name}
              </Link>
            </li>
            <li><span className="mx-2">/</span></li>
          </>
        )}

        {/* Aktif kategori */}
        {category ? (
          <>
            <li>
              <Link
                href={`/categories/${category.slug}`}
                className="hover:text-gray-800"
              >
                {category.name}
              </Link>
            </li>
            <li><span className="mx-2">/</span></li>
          </>
        ) : (
          <>
            <li><span>Kategori Yok</span></li>
            <li><span className="mx-2">/</span></li>
          </>
        )}

        {/* Ürün adı */}
        <li className="text-gray-900 font-medium">
          {groupName ? `${groupName} – ${productName}` : productName}
        </li>
      </ol>
    </nav>
  );
}
