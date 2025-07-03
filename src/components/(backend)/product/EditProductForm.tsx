"use client";

import { useTransition, useState } from "react";
import RichTextEditor from "@/app/(admin)/administor/ui/RichTextEditor";
import { updateProduct } from "@/actions/updateProduct";
import MediaModalButton from "@/app/(frontend)/modal/MediaModalButton";

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
  discount?: number; // 👈 indirimli fiyat
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
  const [attributeIds, setAttributeIds] = useState<string[]>(product.attributeIds);
  const [discount, setDiscount] = useState(product.discount ?? 0);

  // Media state artık Media[] olarak tutuluyor
  const [selectedMedias, setSelectedMedias] = useState<Media[]>(
    medias.filter((m) => product.mediaIds.includes(m.id))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", String(price));

    brandIds.forEach((id) => formData.append("brandIds[]", id));
    categoryIds.forEach((id) => formData.append("categoryIds[]", id));
    attributeIds.forEach((id) => formData.append("attributeIds[]", id));
    selectedMedias.forEach((media) =>
      formData.append("mediaIds[]", media.id)
    );

    startTransition(async () => {
      const res = await updateProduct(product.id, formData);
      if (res?.error) setError(res.error);
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-lg mx-auto px-2"
    >
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
<input
  type="number"
  value={discount || ""}
  onChange={(e) => {
    const val = parseFloat(e.target.value);
    setDiscount(isNaN(val) ? 0 : val);
  }}
  placeholder="İndirimli Fiyat"
  className="py-2 px-3 border rounded"
  step="0.01"
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

      <label className="font-medium">Nitelikler</label>
      <select
        multiple
        value={attributeIds}
        onChange={(e) =>
          setAttributeIds(Array.from(e.target.selectedOptions, (opt) => opt.value))
        }
        className="py-2 px-3 rounded-sm border"
      >
        {attributes.map((attr) => (
          <option key={attr.id} value={attr.id}>
            {attr.name}
          </option>
        ))}
      </select>

      <div>
        <label className="font-medium block mb-2">Medya Dosyaları</label>
        <MediaModalButton
          medias={medias}
          selectedMedias={selectedMedias}
          onSelectedMediasChange={setSelectedMedias}
        />
      </div>

      {/* Opsiyonel: selectedMedias hidden inputları */}
      {selectedMedias.map((media) => (
        <input key={media.id} type="hidden" name="mediaIds[]" value={media.id} />
      ))}

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
