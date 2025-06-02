"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [min, setMin] = useState(searchParams.get("price_gte") ?? "");
  const [max, setMax] = useState(searchParams.get("price_lte") ?? "");

  const apply = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (min) params.set("price_gte", min);
    else params.delete("price_gte");

    if (max) params.set("price_lte", max);
    else params.delete("price_lte");

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block font-medium">Min Fiyat</label>
        <input
          type="number"
          className="w-full border rounded px-2 py-1"
          value={min}
          onChange={(e) => setMin(e.target.value)}
        />
      </div>

      <div>
        <label className="block font-medium">Max Fiyat</label>
        <input
          type="number"
          className="w-full border rounded px-2 py-1"
          value={max}
          onChange={(e) => setMax(e.target.value)}
        />
      </div>

      <button
        onClick={apply}
        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
      >
        Filtrele
      </button>
    </div>
  );
}
