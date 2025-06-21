"use client";

import { useActionState } from "react";
import { createAttribute } from "./action";
import { Media } from "@/types/product";

interface CreateAttributeGroup {
  id: string;
  name: string;
  attributeIds: string;
  medias: Media[];
}

interface CategoryFormProps {
  attributeGroups: CreateAttributeGroup[];
  medias: Media[];
}

export default function CreateAttributeForm({ attributeGroups, medias }: CategoryFormProps) {
  const [state, formAction] = useActionState(createAttribute, null);

  return (
    <main className="mx-auto max-w-lg">
      <h1>Ürün Yönetim Sayfası</h1>
      <form action={formAction} method="POST" className="flex flex-col px-2 gap-3">
        <input 
          type="text" 
          name="name" 
          placeholder="Nitelik Adı (örn. Erkek, Kız, Unisex)" 
          className="py-2 px-3 rounded-sm" 
          required 
        />
       
        <select name="groupId" className="py-2 px-3 rounded-sm" required>
          <option value="">Nitelik Grubu Seç</option>
          {attributeGroups.map((group) => (
            <option key={group.id} value={group.id}>{group.name}</option>
          ))}
        </select>

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

        <button type="submit" className="bg-blue-500 text-white py-2 px-3">Gönder</button>
        {state && <p className="text-red-500">{state}</p>}
      </form>
    </main>
  );
}
