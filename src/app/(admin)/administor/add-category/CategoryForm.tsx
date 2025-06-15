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

// ----- Yardımcı: Kategori ağacı oluştur -----
function buildCategoryTree(categories: Category[]) {
  const map = new Map<string, Category & { children: Category[] }>();
  const roots: (Category & { children: Category[] })[] = [];

  for (const cat of categories) {
    map.set(cat.id, { ...cat, children: [] });
  }

  for (const cat of map.values()) {
    if (cat.parentId && map.has(cat.parentId)) {
      map.get(cat.parentId)!.children.push(cat);
    } else {
      roots.push(cat);
    }
  }

  return roots;
}

// ----- Yardımcı: Kategorileri düzleştir (label'lı) -----
function flattenCategoryTree(
  tree: (Category & { children: Category[] })[],
  prefix = ""
): { id: string; label: string }[] {
  const result: { id: string; label: string }[] = [];

  for (const node of tree) {
    const label = prefix ? `${prefix} / ${node.name}` : node.name;
    result.push({ id: node.id, label });
    result.push(...flattenCategoryTree(node.children, label));
  }

  return result;
}

// ----- Form State Tipi -----
interface FormState {
  ok: boolean;
  message: string;
}

interface Category {
  id: string;
  name: string;
  parentId?: string | null;
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

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  useEffect(() => {
    setSlug(slugify(name));
  }, [name]);

  // Hiyerarşik kategori label'larını hazırla
  const categoryTree = buildCategoryTree(categories);
  const flatOptions = flattenCategoryTree(categoryTree);

  return (
    <main className="mx-auto max-w-lg space-y-4">
      <h1 className="text-xl font-bold">Kategori Oluştur</h1>

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
        <input
          required
          type="text"
          name="name"
          placeholder="Kategori Adı"
          className="border rounded px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          required
          type="text"
          name="slug"
          placeholder="slug"
          className="border rounded px-3 py-2"
          value={slug}
          onChange={(e) => setSlug(slugify(e.target.value))}
        />

        <textarea
          name="description"
          placeholder="Açıklama"
          className="border rounded px-3 py-2 min-h-[80px]"
        />

        <select name="parentId" className="border rounded px-3 py-2">
          <option value="">Üst Kategori Yok</option>
          {flatOptions.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>

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
