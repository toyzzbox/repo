"use client";

import { useState, useTransition } from "react";
import { Brand } from "@/types/brand";
import { updateBrand } from "@/actions/updateBrand";
import MediaModalButton from "@/app/(frontend)/modal/MediaModalButton";
import { Label } from "@/components/ui/label";

interface Media {
  id: string;
  urls: string[];
}
interface Props {
  brand: Brand & { mediaIds: string[] };
  medias: Media[];
}

export default function EditBrandForm({ brand, medias }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState(brand.name);
  const [description, setDescription] = useState(brand.description ?? "");

  const [selectedMedias, setSelectedMedias] = useState<Media[]>(
    medias.filter(media => brand.mediaIds.includes(media.id))
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    selectedMedias.forEach((media) =>
      formData.append("mediaIds[]", media.id)
    );

    startTransition(async () => {
      const result = await updateBrand(brand.id, formData);

      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <main className="mx-auto max-w-lg">
      <h1 className="text-xl font-bold mb-4">Marka Güncelle</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="py-2 px-3 border rounded w-full"
          required
        />

        <input
          type="text"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="py-2 px-3 border rounded w-full"
          required
        />

<div className="space-y-2">
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
      </div>

        <button
          type="submit"
          disabled={isPending}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition w-full"
        >
          {isPending ? "Güncelleniyor..." : "Markayı Güncelle"}
        </button>

        {error && <p className="text-red-500">{error}</p>}
      </form>
    </main>
  );
}
