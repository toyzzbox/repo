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

// ----- Yardımcı: Kategori Ağacını Oluştur -----
function buildCategoryTree(categories) {
  const map = new Map();
  const roots = [];

  for (const c of categories) {
    map.set(c.id, { ...c, children: [] });
  }

  for (const c of map.values()) {
    if (c.parentId && map.has(c.parentId)) {
      map.get(c.parentId).children.push(c);
    } else {
      roots.push(c);
    }
  }

  return roots;
}

// ----- Düz liste haline getir -----
function flattenCategoryTree(tree, prefix = "") {
  let result = [];

  for (const node of tree) {
    const label = prefix ? `${prefix} / ${node.name}` : node.name;
    result.push({ id: node.id, label });
    result = result.concat(flattenCategoryTree(node.children, label));
  }

  return result;
}

export default function CategoryForm({ categories, medias }) {
  const [formState, formAction, isPending] = useActionState(
    async (_, formData) => {
      const msg = await createCategory(_, formData);
      return {
        ok: msg.startsWith("Kategori"),
        message: msg,
      };
    },
    { ok: false, message: "" }
  );

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [order, setOrder] = useState(0);

  useEffect(() => {
    setSlug(slugify(name));
  }, [name]);

  const tree = buildCategoryTree(categories);
  const flatOptions = flattenCategoryTree(tree);

  return (
    <main className="mx-auto max-w-lg space-y-4">
      <h1 className="text-xl font-bold">Kategori Oluştur</h1>

      {formState.message && (
        <p
          className={`p-2 rounded text-sm ${
            formState.ok
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {formState.message}
        </p>
      )}

      <form action={formAction} className="flex flex-col gap-4">
        {/* Ad */}
        <input
          required
          type="text"
          name="name"
          placeholder="Kategori Adı"
          className="border rounded px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Slug */}
        <input
          required
          type="text"
          name="slug"
          placeholder="Slug"
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

        {/* Üst Kategori */}
        <select name="parentId" className="border rounded px-3 py-2">
          <option value="">Üst Kategori Yok</option>
          {flatOptions.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Order */}
        <input
          type="number"
          name="order"
          placeholder="Sıralama"
          className="border rounded px-3 py-2"
          min={0}
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
        />

        {/* ✔ Media (çoklu seçim) */}
        <label className="font-medium">Medya Dosyaları</label>

        <select
          name="mediaIds[]"
          multiple
          className="border rounded px-3 py-2 h-32"
        >
          {medias.map((m) => (
            <option key={m.id} value={m.id}>
              {m.variants?.[0]?.cdnUrl ?? m.title ?? m.id}
            </option>
          ))}
        </select>

        {/* Submit */}
        <button
          disabled={isPending}
          className="bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          {isPending ? "Gönderiliyor..." : "Kategori Oluştur"}
        </button>
      </form>
    </main>
  );
}
