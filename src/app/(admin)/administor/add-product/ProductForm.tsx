"use client";

import { useActionState, useState } from "react";
import { createProduct } from "./action";
import RichTextEditor from "@/components/(frontend)/rich-text-editor";
import MediaModalButton from "@/app/(frontend)/modal/MediaModalButton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import MultiSelect from "@/components/ui/MultiSelect";

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

  // Eksik olan state tanımları eklendi:
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>([]);

  return (
    <form action={formAction} className="space-y-4">
      <h1 className="text-2xl font-bold">Ürün Ekle</h1>

      {/* Ürün Adı */}
      <div>
        <Label htmlFor="name">Ürün Adı</Label>
        <Input type="text" id="name" name="name" required />
      </div>

      {/* Seri Numarası */}
      <div>
        <Label htmlFor="serial">Seri Numarası (opsiyonel)</Label>
        <Input type="text" id="serial" name="serial" />
      </div>

      {/* Stok */}
      <div>
        <Label htmlFor="stock">Stok</Label>
        <Input type="number" id="stock" name="stock" required min={0} />
      </div>

      {/* Fiyat */}
      <div>
        <Label htmlFor="price">Fiyat</Label>
        <Input type="number" step="0.01" id="price" name="price" required />
      </div>

      {/* İndirim */}
      <div>
        <Label htmlFor="discount">İndirimli Fiyat</Label>
        <Input type="number" step="0.01" id="discount" name="discount" />
      </div>

      {/* Ürün Grubu */}
      <div>
        <Label htmlFor="groupId">Ürün Grubu (opsiyonel)</Label>
        <select id="groupId" name="groupId" className="border px-2 py-1 rounded w-full">
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
        <Label>Açıklama</Label>
        <RichTextEditor
          onChange={(html) => {
            setDescriptionHtml(html);
          }}
        />
        <input type="hidden" name="description" value={descriptionHtml} />
      </div>

      {/* MultiSelect Category */}
      <MultiSelect
        items={categories}
        selected={selectedCategoryIds}
        setSelected={setSelectedCategoryIds}
        placeholder="Kategori ara..."
        label="Kategoriler"
      />

      {/* MultiSelect Brand (opsiyonel ekledim) */}
      <MultiSelect
        items={brands}
        selected={selectedBrandIds}
        setSelected={setSelectedBrandIds}
        placeholder="Marka ara..."
        label="Markalar"
      />

      {/* Hidden inputs for selected brands & categories */}
      {selectedBrandIds.map((id) => (
        <input key={id} type="hidden" name="brandIds[]" value={id} />
      ))}
      {selectedCategoryIds.map((id) => (
        <input key={id} type="hidden" name="categoryIds[]" value={id} />
      ))}

      {/* Media, description, diğer inputlar */}
      <div className="space-y-2">
        <Label>Ürün Medyaları</Label>
        <MediaModalButton
          medias={medias}
          onSelectedMediasChange={setSelectedMedias}
          selectedMedias={selectedMedias}
        />
        {selectedMedias.map((media) => (
          <input
            key={media.id}
            type="hidden"
            name="mediaIds[]"
            value={media.id}
          />
        ))}
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
