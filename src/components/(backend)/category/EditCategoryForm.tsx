"use client";

import { useState, useTransition } from "react";
import RichTextEditor from "@/app/(admin)/administor/ui/RichTextEditor";
import { updateCategory } from "@/actions/updateCategory";
import MediaModal from "@/app/(frontend)/modal/MediaModal";

interface Media {
  id: string;
  files: { url: string }[];   // 🔥 artık files üzerinden geliyor
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  mediaIds: string[];
  parentId?: string;
}

interface CategoryOption {
  id: string;
  name: string;
}

interface EditCategoryFormProps {
  category: Category;
  allCategories: CategoryOption[];
  medias: Media[];
}

export default function EditCategoryForm({
  category,
  allCategories,
  medias,
}: EditCategoryFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(category.name);
  const [slug, setSlug] = useState(category.slug);
  const [description, setDescription] = useState(category.description || "");
  const [mediaIds, setMediaIds] = useState<string[]>(category.mediaIds || []);
  const [parentId, setParentId] = useState<string | undefined>(category.parentId);

  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append("id", category.id);
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("description", description);
    if (parentId) formData.append("parentId", parentId);
    mediaIds.forEach((id) => formData.append("mediaIds[]", id));

    startTransition(async () => {
      const res = await updateCategory(category.id, formData);
      if (res && typeof res === "object" && "error" in res) {
        setError(res.error);
      }
    });
  };

  const handleMediaChange = (selectedMedias: Media[]) => {
    setMediaIds(selectedMedias.map((m) => m.id));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg mx-auto px-2">
      <h1 className="text-xl font-bold mb-4">Kategoriyi Güncelle</h1>

      <label className="font-medium">Adı</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="py-2 px-3 border rounded"
        required
      />

      <label className="font-medium">Slug</label>
      <input
        type="text"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        className="py-2 px-3 border rounded"
        required
      />

      <label className="font-medium">Açıklama</label>
      <RichTextEditor value={description} onChange={setDescription} />

      <label className="font-medium">Üst Kategori</label>
      <select
        value={parentId ?? ""}
        onChange={(e) => setParentId(e.target.value || undefined)}
        className="py-2 px-3 border rounded"
      >
        <option value="">— Üst kategori yok —</option>
        {allCategories
          .filter((c) => c.id !== category.id)
          .map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
      </select>

      <label className="font-medium">Medya</label>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setIsMediaModalOpen(true)}
          className="bg-gray-200 py-2 px-4 rounded hover:bg-gray-300 transition"
        >
          Medya Seç ({mediaIds.length})
        </button>

        <div className="flex flex-wrap gap-2">
          {medias
            .filter((m) => mediaIds.includes(m.id))
            .map((media) => (
              <img
                key={media.id}
                src={media.files?.[0]?.url || ""}
                alt="selected"
                className="w-16 h-16 object-cover rounded"
              />
            ))}
        </div>
      </div>

      <button
        disabled={isPending}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
      >
        {isPending ? "Güncelleniyor..." : "Kategoriyi Güncelle"}
      </button>

      {error && <p className="text-red-500">{error}</p>}

      <MediaModal
        open={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        medias={medias}
        selectedMediaIds={mediaIds}
        onSelectedMediasChange={handleMediaChange}
      />
    </form>
  );
}
