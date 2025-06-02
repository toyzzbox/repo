"use client";

import { useState } from "react";

export type SortOption = "default" | "price_asc" | "price_desc" | "date_desc" | "stock_desc" | "name_asc";

interface SortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export default function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <div className="flex justify-end mb-4">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="border px-3 py-1 rounded"
      >
        <option value="default">Varsayılan</option>
        <option value="price_asc">Fiyat: Artan</option>
        <option value="price_desc">Fiyat: Azalan</option>
        <option value="date_desc">En Yeni Ürünler</option>
        <option value="stock_desc">Stok: Yüksekten Düşüğe</option>
        <option value="name_asc">İsim: A-Z</option>
      </select>
    </div>
  );
}
