"use client";

import { useTransition, useState } from "react";
import RichTextEditor from "@/app/(admin)/administor/ui/RichTextEditor";
import { updateProduct } from "@/actions/updateProduct";

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

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  brandIds: string[];
  categoryIds: string[];
  mediaIds: string[];
  attributeIds: string[];
}

interface EditProductFormProps {
  product: Product;
  brands: Brand[];
  categories: Category[];
  medias: Media[];
  attributes: Attribute[];
}

export default function EditProductForm({
  product,
  brands,
  categories,
  medias,
  attributes,
}: EditProductFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price);
  const [brandIds, setBrandIds] = useState<string[]>(product.brandIds);
  const [categoryIds, setCategoryIds] = useState<string[]>(product.categoryIds);
  const [mediaIds, setMediaIds] = useState<string[]>(product.mediaIds);
  const [attributeIds, setAttributeIds] = useState<string[]>(product.attributeIds);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", String(price));
    brandIds.forEach(id => formData.append("brandIds[]", id));
    categoryIds.forEach(id => formData.append("categoryIds[]", id));
    mediaIds.forEach(id => formData.append("mediaIds[]", id));
    attributeIds.forEach(id => formData.append("attributeIds[]", id));

    startTransition(async () => {
      const res = await updateProduct(product.id, formData);
      if (res?.error) setError(res.error);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg mx-auto px-2">
      <h1 className="text-xl font-bold mb-4">Ürünü Güncelle</h1>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ürün Adı"
        className="py-2 px-3 border rounded"
        required
      />

      <label className="font-medium">Açıklama</label>
      <RichTextEditor value={description} onChange={setDescription} />

      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(parseFloat(e.target.value))}
        placeholder="Fiyat"
        className="py-2 px-3 border rounded"
        step="0.01"
        required
      />

      <label className="font-medium">Markalar</label>
      <select
        multiple
        value={brandIds}
        onChange={(e) =>
          setBrandIds(Array.from(e.target.selectedOptions, (opt) => opt.value))
        }
        className="py-2 px-3 border rounded"
      >
        {brands.map((brand) => (
          <option key={brand.id} value={brand.id}>
            {brand.name}
          </option>
        ))}
      </select>

      <label className="font-medium">Kategoriler</label>
      <select
        multiple
        value={categoryIds}
        onChange={(e) =>
          setCategoryIds(Array.from(e.target.selectedOptions, (opt) => opt.value))
        }
        className="py-2 px-3 border rounded"
      >
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <label className="font-medium">Medya Dosyaları</label>
      <select
        multiple
        value={mediaIds}
        onChange={(e) =>
          setMediaIds(Array.from(e.target.selectedOptions, (opt) => opt.value))
        }
        className="py-2 px-3 border rounded"
      >
        {medias.map((media) => (
          <option key={media.id} value={media.id}>
            {media.urls[0]?.slice(-40) || "Media"}
          </option>
        ))}
      </select>

      <label className="font-medium">Nitelikler</label>
      <select
        multiple
        value={attributeIds}
        onChange={(e) =>
          setAttributeIds(Array.from(e.target.selectedOptions, (opt) => opt.value))
        }
        className="py-2 px-3 rounded-sm"
      >
        {attributes.map((attr) => (
          <option key={attr.id} value={attr.id}>
            {attr.name}
          </option>
        ))}
      </select>

      <button
        disabled={isPending}
        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
      >
        {isPending ? "Güncelleniyor..." : "Ürünü Güncelle"}
      </button>

      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
