'use client';

import { useState, useTransition } from "react";

import { Brand } from "@/types/brand";
import { Media } from "@/types/product";
import { updateBrand } from "@/actions/updateBrand";
import MediaSelector from "@/app/(admin)/administor/add-product/MediaSelector";

interface Props {
  brand: Brand & { mediaIds: string[] };
  medias: Media[];
}

export default function EditBrandForm({ brand, medias }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState(brand.name);
  const [description, setDescription] = useState(brand.description ?? "");
  const [selectedMediaIds, setSelectedMediaIds] = useState<string[]>(brand.mediaIds || []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    selectedMediaIds.forEach((id) => formData.append("mediaIds[]", id));

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

<MediaSelector
  medias={medias}
  defaultSelected={selectedMediaIds}
  onChange={setSelectedMediaIds}
/>

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
