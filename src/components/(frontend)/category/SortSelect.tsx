"use client";

import { SortAsc } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SortSelect() {
  const router = useRouter();
  const params = useSearchParams();
  const current = params.get("sort") ?? "newest";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const url = new URL(window.location.href);
    url.searchParams.set("sort", e.target.value);
    router.push(url.pathname + "?" + url.searchParams.toString());
  };

  return (
    <div className="mb-6 flex items-center gap-2">
      <SortAsc className="w-5 h-5 text-gray-500" />
      <label className="font-medium">Sırala:</label>
      <select
        value={current}
        onChange={handleChange}
        className="border border-gray-300 rounded p-2"
      >
        <option value="newest">En Yeni</option>
        <option value="price_asc">Fiyat: Artan</option>
        <option value="price_desc">Fiyat: Azalan</option>
        <option value="name_asc">İsim: A → Z</option>
        <option value="name_desc">İsim: Z → A</option>
      </select>
    </div>
  );
}