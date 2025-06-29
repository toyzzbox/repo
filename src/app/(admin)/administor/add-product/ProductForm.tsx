"use client";

import { useActionState, useState } from "react";
import { createProduct } from "./action";
import RichTextEditor from "@/components/(frontend)/rich-text-editor";
import MediaModalButton from "@/app/(frontend)/modal/MediaModalButton";

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
  const [selectedMedias, setSelectedMedias] = useState<Media[]>([]);

  return (
    <form action={formAction} className="space-y-4">
      <h1 className="text-2xl font-bold">Ürün Ekle</h1>

      {/* Ürün Grubu */}
      <div>
        <label>Ürün Grubu (opsiyonel)</label>
        <select name="groupId">
          <option value="">— Grupsuz Ürün —</option>
          {productGroups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>

      {/* Açıklama */}
      <div>
        <label>Açıklama</label>
        <RichTextEditor
          onChange={(html) => {
            setDescriptionHtml(html);
          }}
        />
        <input type="hidden" name="description" value={descriptionHtml} />
      </div>

      {/* Marka Seçimi */}
      <div>
        <label>Markalar</label>
        <select name="brandId">
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>

      {/* Kategori Seçimi */}
      <div>
        <label>Kategoriler</label>
        <select name="categoryId">
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Seçili Medyalar Hidden Input */}
      {selectedMedias.map((media) => (
        <input key={media.id} type="hidden" name="mediaIds" value={media.id} />
      ))}

      {/* Medya Seçimi */}
      <div>
        <label className="block mb-2">Ürün Medyaları</label>
        <MediaModalButton
          medias={medias}
          onSelectedMediasChange={setSelectedMedias}
          selectedMedias={selectedMedias}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isPending ? "Kaydediliyor..." : "Ürünü Kaydet"}
      </button>

      {state && <div className="text-red-500">{state}</div>}
    </form>
  );
}
