"use client";

import { useActionState } from "react";
import { createProduct } from "./action";

interface Brand {
  id: string;
  name: string;
}

interface Attribute {
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

interface ProductFormProps {
  brands: Brand[];
  categories: Category[];
  medias: Media[];
  attributes: Attribute[];

}

export default function ProductForm({ brands, categories, medias , attributes}: ProductFormProps) {
  const [error, action, isPending] = useActionState(createProduct, null);

  return (
    <main className="mx-auto max-w-lg">
      <h1 className="text-xl font-bold mb-4">Ürün Yönetim Sayfası</h1>

      <form action={action} method="POST" className="flex flex-col px-2 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Ürün Adı"
          className="py-2 px-3 border rounded"
          required
        />

        <input
          type="text"
          name="description"
          placeholder="Açıklama"
          className="py-2 px-3 border rounded"
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Fiyat"
          className="py-2 px-3 border rounded"
          step="0.01"
          required
        />

        <label className="font-medium">Markalar</label>
        <select name="brandIds[]" multiple className="py-2 px-3 border rounded">
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>

        <label className="font-medium">Kategoriler</label>
        <select name="categoryIds[]" multiple className="py-2 px-3 border rounded">
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <label className="font-medium">Medya Dosyaları</label>
        <select name="mediaIds[]" multiple className="py-2 px-3 border rounded">
          {medias.map((media) => (
            <option key={media.id} value={media.id}>
              {media.urls[0]?.slice(-40) || "Media"}
            </option>
          ))}
        </select>


        <select name="attributeIds[]" multiple className="py-2 px-3 rounded-sm">
        <option value="">Nitelik Seç</option>
          {attributes.map((attributes) => (
            <option key={attributes.id} value={attributes.id}>{attributes.name}</option>
          ))}
        </select>
        

        <button
          disabled={isPending}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          {isPending ? "Gönderiliyor..." : "Ürünü Kaydet"}
        </button>

        {error && <p className="text-red-500">{error}</p>}
      </form>
    </main>
  );
}
