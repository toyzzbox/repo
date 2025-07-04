'use client';

import Link from "next/link";

interface ProductBreadcrumbProps {
  category?: { slug: string; name: string };
  groupName?: string;
  productName: string;
}

export default function ProductBreadcrumb({
  category,
  groupName,
  productName,
}: ProductBreadcrumbProps) {
  return (
    <nav className="py-2 px-4 text-sm text-gray-600" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center">
        <li>
          <Link href="/" className="hover:text-gray-800">
            Anasayfa
          </Link>
        </li>

        <li>
          <span className="mx-2">/</span>
        </li>

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
            <li>
              <span className="mx-2">/</span>
            </li>
          </>
        ) : (
          <>
            <li>
              <span>Kategori Yok</span>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
          </>
        )}

        <li className="text-gray-900 font-medium">
          {groupName ? `${groupName} – ${productName}` : productName}
        </li>
      </ol>
    </nav>
  );
}
