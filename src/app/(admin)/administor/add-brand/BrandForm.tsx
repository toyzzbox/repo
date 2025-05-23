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

      <form action={action} method="POST" className="flex flex-row px-2 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Ürün Adı"
          className="py-2 px-3 border rounded"
          required
        />

        <input
          type="text"
          name="description"
          placeholder="Açıklama"
          className="py-2 px-3 border rounded"
          required
        />

        <label className="font-medium">Medya Dosyaları</label>
        <select name="mediaIds[]" multiple className="py-2 px-3 border rounded">
          {medias.map((media) => (
            <option key={media.id} value={media.id}>
              {media.urls[0]?.slice(-40) || "Media"}
            </option>
          ))}
        </select>

        <button
          disabled={isPending}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          {isPending ? "Gönderiliyor..." : "Ürünü Kaydet"}
        </button>

        {error && <p className="text-red-500">{error}</p>}
      </form>
    </main>
  );
}
