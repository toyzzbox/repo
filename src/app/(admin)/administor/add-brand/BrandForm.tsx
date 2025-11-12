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
    <main className="mx-auto max-w-lg p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Marka Yönetim Sayfası</h1>

      <form action={action} method="POST" className="flex flex-col gap-5 w-full">
        {/* Marka Adı */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="name" className="font-medium text-gray-700">
            Marka Adı
          </Label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Marka Adı"
            className="py-2 px-3 border border-gray-300 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
        </div>

        {/* Açıklama */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="description" className="font-medium text-gray-700">
            Açıklama
          </Label>
          <input
            id="description"
            type="text"
            name="description"
            placeholder="Marka Açıklaması"
            className="py-2 px-3 border border-gray-300 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
        </div>

        {/* Medya Alanı */}
        <div className="flex flex-col gap-3">
          <Label className="font-medium text-gray-700">Marka Medyaları</Label>
          <MediaModalButton
            medias={medias}
            onSelectedMediasChange={setSelectedMedias}
            selectedMedias={selectedMedias}
          />
        </div>

        {/* ✅ Gizli input'lar: FormData'ya sıralı şekilde aktarılır */}
        {selectedMedias.map((media, index) => (
          <div key={media.id}>
            <input
              type="hidden"
              name={`mediaIds[${index}].id`}
              value={media.id}
            />
            <input
              type="hidden"
              name={`mediaIds[${index}].order`}
              value={index}
            />
          </div>
        ))}

        {/* Gönder Butonu */}
        <button
          disabled={isPending}
          className={`mt-4 bg-blue-600 text-white py-2 px-4 rounded-md font-semibold transition-colors ${
            isPending
              ? "opacity-70 cursor-not-allowed"
              : "hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
          }`}
        >
          {isPending ? "Kaydediliyor..." : "Markayı Kaydet"}
        </button>

        {/* Hata mesajı */}
        {error && (
          <p className="text-red-500 mt-2 text-sm font-medium">{error}</p>
        )}
      </form>
    </main>
  );
}
