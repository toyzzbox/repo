"use client";

import { useActionState, useState } from "react";
import { createAttribute } from "./action";
import MediaModalButton from "@/app/(frontend)/modal/MediaModalButton";
import { Media } from "@/types/product";

interface CreateAttributeGroup {
  id: string;
  name: string;
}

interface CategoryFormProps {
  attributeGroups: CreateAttributeGroup[];
  medias: Media[]; // { id: string; urls: string[] }
}

export default function CreateAttributeForm({ attributeGroups, medias }: CategoryFormProps) {
  const [error, formAction] = useActionState(createAttribute, null);

  const [selectedMedias, setSelectedMedias] = useState<Media[]>([]);

  return (
    <main className="mx-auto max-w-lg">
      <h1 className="font-bold text-xl mb-4">Yeni Nitelik Oluştur</h1>

      <form action={formAction} className="flex flex-col px-2 gap-3">
        <input
          type="text"
          name="name"
          placeholder="Nitelik Adı (Erkek, Kız, Unisex)"
          className="py-2 px-3 rounded-sm border"
          required
        />

        <select name="groupId" className="py-2 px-3 rounded-sm border" required>
          <option value="">Nitelik Grubu Seç</option>
          {attributeGroups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>

        {/* ⭐ Modal ile medya seçimi */}
        <div className="flex flex-col gap-2">
          <label className="font-medium">Medya Seç</label>

          <MediaModalButton
            medias={medias}
            selectedMedias={selectedMedias}
            onSelectedMediasChange={setSelectedMedias}
          />
        </div>

        {/* Gizli inputlar */}
        {selectedMedias.map((m, i) => (
          <input key={m.id} type="hidden" name={`mediaIds[${i}]`} value={m.id} />
        ))}

        <button className="bg-blue-600 text-white rounded px-4 py-2">
          Gönder
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </main>
  );
}
