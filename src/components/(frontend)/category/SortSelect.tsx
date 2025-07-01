"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
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
    <Button
      variant="outline"
      className="w-full rounded-none py-4 flex items-center justify-center gap-2"
    >
      <ArrowUpDown className="w-5 h-5" />
      <label htmlFor="sort" className="font-medium">
        Sırala
      </label>
      <select
        id="sort"
        value={current}
        onChange={handleChange}
        className="bg-transparent outline-none"
      >
        <option value="newest">En Yeni</option>
        <option value="price_asc">Fiyat: Artan</option>
        <option value="price_desc">Fiyat: Azalan</option>
        <option value="name_asc">İsim: A → Z</option>
        <option value="name_desc">İsim: Z → A</option>
      </select>
    </Button>
  );
}