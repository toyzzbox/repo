"use client";

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
    <div className="mb-6">
      <label className="mr-2 font-medium">Sırala:</label>
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
