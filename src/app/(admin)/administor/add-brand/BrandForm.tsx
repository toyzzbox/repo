"use client";

import { useActionState, useState } from "react";
import { createBrand } from "./action";
import MediaModalButton from "@/app/(frontend)/modal/MediaModalButton";

type Media = {
  id: string;
  variants: { cdnUrl: string; key: string; type: string }[];
};

interface BrandFormProps {
  medias: Media[];
}

export default function BrandForm({ medias }: BrandFormProps) {
  const [error, action, isPending] = useActionState(createBrand, null);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);

  return (
    <form action={action} method="POST" className="flex flex-col gap-6">
      <input name="name" required placeholder="Marka Adı" />
      <input name="description" required placeholder="Açıklama" />

      <MediaModalButton
        medias={medias}
        single={true}
        selectedMedias={selectedMedia ? [selectedMedia] : []}
        onSelectedMediasChange={(arr) => setSelectedMedia(arr[0] || null)}
      />

      {selectedMedia && (
        <input type="hidden" name="mediaId" value={selectedMedia.id} />
      )}

      <button disabled={isPending}>
        {isPending ? "Kaydediliyor..." : "Kaydet"}
      </button>

      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
