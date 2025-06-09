"use client";

import { useActionState, useState } from "react";
import { createProduct } from "./action";
import RichTextEditor from "@/components/(frontend)/rich-text-editor";
import MediaSelector from "./MediaSelector";

interface Brand {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface Media {
  id: string;
  urls: string[];
}

interface ProductGroup {
  id: string;
  name: string;
}

interface ProductFormProps {
  brands: Brand[];
  categories: Category[];
  medias: Media[];
  productGroups: ProductGroup[];
}

export default function ProductForm({
  brands,
  categories,
  medias,
  productGroups,
}: ProductFormProps) {


  
  const [state, formAction, isPending] = useActionState(createProduct, null);
  const [descriptionHtml, setDescriptionHtml] = useState("");

  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Ürün Ekle</h1>

      <form action={formAction} className="flex flex-col gap-4">
        <label className="font-medium">Ürün Grubu (opsiyonel)</label>
        <select name="groupId" className="border rounded px-3 py-2">
          <option value="">— Grupsuz Ürün —</option>
          {productGroups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="name"
          placeholder="Ürün Adı"
          className="border rounded px-3 py-2"
          required
        />

        <input
          type="text"
          name="serial"
          placeholder="Stok Kodu (opsiyonel)"
          className="border rounded px-3 py-2"
        />

        <input
          type="number"
          name="stock"
          placeholder="Stok Adedi (opsiyonel)"
          className="border rounded px-3 py-2"
        />

        <input
          type="number"
          name="price"
          step="0.01"
          placeholder="Fiyat"
          className="border rounded px-3 py-2"
          required
        />

<label className="font-medium">Açıklama</label>
<RichTextEditor
  description=""
  onChange={(html) => {
    setDescriptionHtml(html);
  }}
/>
<input type="hidden" name="description" value={descriptionHtml} />

        {/* Marka Seçimi */}
        <label className="font-medium">Markalar</label>
        <select name="brandIds[]" multiple className="border rounded px-3 py-2">
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>

        {/* Kategori Seçimi */}
        <label className="font-medium">Kategoriler</label>
        <select name="categoryIds[]" multiple className="border rounded px-3 py-2">
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        {/* Medya Seçimi */}
        <MediaSelector medias={medias} />

        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
        >
          {isPending ? "Kaydediliyor..." : "Ürünü Kaydet"}
        </button>

        {state && <p className="text-red-500">{state}</p>}
      </form>
    </main>
  );
}
