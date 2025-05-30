"use client";

import { useActionState } from "react";
import { createBrand } from "./action";


interface Media {
  id: string;
  urls: string[];
}

interface BrandFormProps {

  medias: Media[];
}

export default function BrandForm({ medias }: BrandFormProps) {
  const [error, action, isPending] = useActionState(createBrand, null);

  return (
    <main className="mx-auto max-w-lg">
      <h1 className="text-xl font-bold mb-4">Marka Yönetim Sayfası</h1>

      <form action={action} method="POST" className="flex flex-col gap-4 w-full">
  <input
    type="text"
    name="name"
    placeholder="Ürün Adı"
    className="py-2 px-3 border rounded w-full"
    required
  />

  <input
    type="text"
    name="description"
    placeholder="Açıklama"
    className="py-2 px-3 border rounded w-full"
    required
  />

  <div className="flex flex-col">
    <label className="font-medium mb-1">Medya Dosyaları</label>
    <select name="mediaIds[]" multiple className="py-2 px-3 border rounded w-full">
      {medias.map((media) => (
        <option key={media.id} value={media.id}>
          {media.urls[0]?.slice(-40) || "Media"}
        </option>
      ))}
    </select>
  </div>

  <button
    disabled={isPending}
    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition w-full"
  >
    {isPending ? "Gönderiliyor..." : "Ürünü Kaydet"}
  </button>

  {error && <p className="text-red-500">{error}</p>}
</form>

    </main>
  );
}
