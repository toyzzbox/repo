"use client";

import { useActionState, useEffect, useState } from "react";
import { createCategory } from "./action";

// ----- Yardımcı: basit slugify -----
function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ----- Form State Tipi -----
interface FormState {
  ok: boolean;
  message: string;
}

interface Category {
  id: string;
  name: string;
}
interface Media {
  id: string;
  urls: string[];
}
interface CategoryFormProps {
  categories: Category[];
  medias: Media[];
}

export default function CategoryForm({ categories, medias }: CategoryFormProps) {
  /* ---------- Server Action binding ---------- */
  const [formState, onSubmit, isPending] = useActionState<FormState, FormData>(
    async (_, formData) => {
      const message = await createCategory(_, formData);
      return {
        ok: message.startsWith("Kategori başarıyla"),
        message,
      };
    },
    { ok: false, message: "" }
  );

  /* ---------- Slug otomasyonu ---------- */
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  useEffect(() => {
    setSlug(slugify(name));
  }, [name]);

  return (
    <main className="mx-auto max-w-lg space-y-4">
      <h1 className="text-xl font-bold">Kategori Oluştur</h1>

      {/* ---- Başarı / Hata Mesajı ---- */}
      {formState.message && (
        <p
          className={`p-2 rounded text-sm ${
            formState.ok ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {formState.message}
        </p>
      )}

      <form action={onSubmit} className="flex flex-col gap-4">
        {/* İsim */}
        <input
          required
          type="text"
          name="name"
          placeholder="Kategori Adı"
          className="border rounded px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Slug (otomatik) */}
        <input
          required
          type="text"
          name="slug"
          placeholder="slug"
          className="border rounded px-3 py-2"
          value={slug}
          onChange={(e) => setSlug(slugify(e.target.value))}
        />

        {/* Açıklama */}
        <textarea
          name="description"
          placeholder="Açıklama"
          className="border rounded px-3 py-2 min-h-[80px]"
        />

        {/* Üst Kategori Seçimi */}
        <select name="parentId" className="border rounded px-3 py-2">
          <option value="">Üst Kategori Yok</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Medya Çoklu Seçim */}
        <label className="font-medium">Medya Dosyaları</label>
        <select
          name="mediaIds[]"
          multiple
          className="border rounded px-3 py-2 h-32"
        >
          {medias.map((m) => (
            <option key={m.id} value={m.id}>
              {m.urls[0] ?? m.id}
            </option>
          ))}
        </select>

        {/* Gönder Butonu */}
        <button
          disabled={isPending}
          className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50"
        >
          {isPending ? "Gönderiliyor..." : "Kategori Oluştur"}
        </button>
      </form>
    </main>
  );
}
