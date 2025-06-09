'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type ProductGroup = {
  id: string;
  name: string;
  serial?: string | null;
};

type Props = {
  groups: ProductGroup[];
};

const ITEMS_PER_PAGE = 10;

export default function ProductGroupsTable({ groups }: Props) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = groups.filter((group) =>
    group.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="space-y-4">
      {/* Arama Kutusu */}
      <Input
        placeholder="Grup adı ara..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1); // Arama değiştiğinde başa dön
        }}
        className="max-w-sm"
      />

      {/* Tablo */}
      <div className="border rounded-md">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-2">Grup Adı</th>
              <th className="px-4 py-2">Seri</th>
              <th className="px-4 py-2 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((group) => (
              <tr key={group.id} className="border-b">
                <td className="px-4 py-2">{group.name}</td>
                <td className="px-4 py-2">{group.serial || "-"}</td>
                <td className="px-4 py-2 text-right">
                  <Link
                    href={`/administor/product-groups/edit/${group.id}`}
                    className="text-blue-500 mr-3"
                  >
                    Düzenle
                  </Link>
                  <form action={`/administor/product-groups/delete/${group.id}`} method="POST" className="inline">
                    <button type="submit" className="text-red-500">Sil</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sayfalama */}
      <div className="flex justify-between items-center">
        <Button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          variant="outline"
        >
          Önceki
        </Button>
        <span>Sayfa {page} / {totalPages}</span>
        <Button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          variant="outline"
        >
          Sonraki
        </Button>
      </div>
    </div>
  );
}
