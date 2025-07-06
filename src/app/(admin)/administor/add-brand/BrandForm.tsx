"use client";

import { useActionState, useState } from "react";
import { createBrand } from "./action";
import { Label } from "@/components/ui/label";
import MediaModalButton from "@/app/(frontend)/modal/MediaModalButton";


interface Media {
  id: string;
  urls: string[];
}

interface BrandFormProps {

  medias: Media[];
}

export default function BrandForm({ medias }: BrandFormProps) {
  const [error, action, isPending] = useActionState(createBrand, null);
  const [selectedMedias, setSelectedMedias] = useState<Media[]>([]);

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

        <Label>Ürün Medyaları</Label>
        <MediaModalButton
          medias={medias}
          onSelectedMediasChange={setSelectedMedias}
          selectedMedias={selectedMedias}
        />
        {selectedMedias.map((media) => (
          <input
            key={media.id}
            type="hidden"
            name="mediaIds[]"
            value={media.id}
          />
        ))}
      
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
