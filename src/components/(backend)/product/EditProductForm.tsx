"use client";

import { useActionState, useState } from "react";
import RichTextEditor from "@/components/(frontend)/rich-text-editor";
import MediaModalButton from "@/app/(frontend)/modal/MediaModalButton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import MultiSelect from "@/components/ui/MultiSelect";
import { updateProduct } from "@/actions/updateProduct";

interface Media {
  id: string;
  urls: string[];
}

interface ProductFormProps {
  product: {
    id: string;
    name: string;
    serial?: string;
    barcode?: string;
    stock: number;
    price: number;
    discount?: number;
    groupId?: string;
    description?: string;
    brandIds: string[];
    categoryIds: string[];
    mediaIds: string[];
  };
  brands: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  medias: Media[];
  productMedias: Media[];
  productGroups: { id: string; name: string }[];
  attributes?: { id: string; name: string }[];
}

export default function EditProductForm({
  product,
  brands,
  categories,
  medias,
  productMedias,
  productGroups,
}: ProductFormProps) {
  const [state, formAction, isPending] = useActionState(updateProduct, null);

  const [descriptionHtml, setDescriptionHtml] = useState(product.description || "");

  // Ürünün mevcut medyaları başlangıç değeri
  const [selectedMedias, setSelectedMedias] = useState<Media[]>(productMedias);

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(product.categoryIds);
  const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>(product.brandIds);

  return (
    <form action={formAction} className="space-y-4">
      <h1 className="text-2xl font-bold">Ürün Güncelle</h1>

      <input type="hidden" name="id" value={product.id} />

      {/* Ürün Adı */}
      <div>
        <Label htmlFor="name">Ürün Adı</Label>
        <Input type="text" id="name" name="name" defaultValue={product.name} required />
      </div>

      {/* Seri */}
      <div>
        <Label>Seri Numarası</Label>
        <Input type="text" name="serial" defaultValue={product.serial || ""} />
      </div>

      {/* Barkod */}
      <div>
        <Label>Barkod</Label>
        <Input type="text" name="barcode" defaultValue={product.barcode || ""} />
      </div>

      {/* Stok */}
      <div>
        <Label>Stok</Label>
        <Input type="number" name="stock" min={0} defaultValue={product.stock} />
      </div>

      {/* Fiyat */}
      <div>
        <Label>Fiyat</Label>
        <Input type="number" step="0.01" name="price" defaultValue={product.price} />
      </div>

      {/* İndirim */}
      <div>
        <Label>İndirimli Fiyat</Label>
        <Input type="number" step="0.01" name="discount" defaultValue={product.discount || ""} />
      </div>

      {/* Grup */}
      <div>
        <Label>Ürün Grubu</Label>
        <select name="groupId" className="border px-2 py-1 rounded w-full" defaultValue={product.groupId || ""}>
          <option value="">— Grupsuz —</option>
          {productGroups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      {/* Açıklama */}
      <div>
        <Label>Açıklama</Label>
        <RichTextEditor initialContent={product.description || ""} onChange={setDescriptionHtml} />
        <input type="hidden" name="description" value={descriptionHtml} />
      </div>

      {/* Kategoriler */}
      <MultiSelect
        items={categories}
        selected={selectedCategoryIds}
        setSelected={setSelectedCategoryIds}
        placeholder="Kategori seç..."
        label="Kategoriler"
