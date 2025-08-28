"use client";

import { useActionState, useState } from "react";
import RichTextEditor from "@/components/(frontend)/rich-text-editor";
import MediaModalButton from "@/app/(frontend)/modal/MediaModalButton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import MultiSelect from "@/components/ui/MultiSelect";
import { updateProduct } from "@/actions/updateProduct";

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

interface Product {
  id: string;
  name: string;
  serial?: string;
  stock: number;
  price: number;
  discount?: number;
  barcode?: string,
  groupId?: string;
  description?: string;
  brandIds: string[];
  categoryIds: string[];
  mediaIds: string[];
}

interface ProductUpdateFormProps {
  product: Product;
  brands: Brand[];
  categories: Category[];
  medias: Media[];
  productGroups: ProductGroup[];
}

export default function EditProductForm({
  product,
  brands,
  categories,
  medias,
  productGroups,
}: ProductUpdateFormProps) {
  const [state, formAction, isPending] = useActionState(updateProduct, null);

  const [descriptionHtml, setDescriptionHtml] = useState(product.description || "");
  const [selectedMedias, setSelectedMedias] = useState<Media[]>(
    product.mediaIds.map((id) => medias.find((m) => m.id === id)!).filter(Boolean)
  );
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(product.categoryIds);
  const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>(product.brandIds);

  return (
    <form action={formAction} className="space-y-4">
      <h1 className="text-2xl font-bold">Ürün Güncelle</h1>

      <input type="hidden" name="id" value={product.id} />

      <div>
        <Label htmlFor="name">Ürün Adı</Label>
        <Input type="text" id="name" name="name" required defaultValue={product.name} />
      </div>

      <div>
        <Label htmlFor="serial">Seri Numarası (opsiyonel)</Label>
        <Input type="text" id="serial" name="serial" defaultValue={product.serial || ""} />
      </div>
      <div className="flex flex-col gap-2">
  <label htmlFor="barcode" className="font-medium text-sm">Barkod</label>
  <input
    type="text"
    id="barcode"
    name="barcode"
    defaultValue={product.barcode || ""}
    className="input"
    minLength={8}
    maxLength={20}
  />
</div>
      <div>
        <Label htmlFor="stock">Stok</Label>
        <Input type="number" id="stock" name="stock" required min={0} defaultValue={product.stock} />
      </div>

      <div>
        <Label htmlFor="price">Fiyat</Label>
        <Input type="number" step="0.01" id="price" name="price" required defaultValue={product.price} />
      </div>

      <div>
        <Label htmlFor="discount">İndirimli Fiyat</Label>
        <Input
          type="number"
          step="0.01"
          id="discount"
          name="discount"
          defaultValue={product.discount || ""}
        />
      </div>

      <div>
        <Label htmlFor="groupId">Ürün Grubu (opsiyonel)</Label>
        <select id="groupId" name="groupId" className="border px-2 py-1 rounded w-full" defaultValue={product.groupId || ""}>
          <option value="">— Grupsuz Ürün —</option>
          {productGroups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label>Açıklama</Label>
        <RichTextEditor onChange={setDescriptionHtml} initialContent={product.description || ""} />
        <input type="hidden" name="description" value={descriptionHtml} />
      </div>

      <MultiSelect
        items={categories}
        selected={selectedCategoryIds}
        setSelected={setSelectedCategoryIds}
        placeholder="Kategori ara..."
        label="Kategoriler"
      />

      <MultiSelect
        items={brands}
        selected={selectedBrandIds}
        setSelected={setSelectedBrandIds}
        placeholder="Marka ara..."
        label="Markalar"
      />

      {selectedBrandIds.map((id) => (
        <input key={id} type="hidden" name="brandIds[]" value={id} />
      ))}
      {selectedCategoryIds.map((id) => (
        <input key={id} type="hidden" name="categoryIds[]" value={id} />
      ))}

      <div className="space-y-2">
        <Label>Ürün Medyaları</Label>
        <MediaModalButton
          medias={medias}
          onSelectedMediasChange={setSelectedMedias}
          selectedMedias={selectedMedias}
          
        />
        {selectedMedias.map((media, index) => (
          <div key={media.id}>
            <input type="hidden" name="mediaIds[]" value={media.id} />
            <input type="hidden" name="mediaOrders[]" value={index} />
          </div>
        ))}
      </div>

      <button type="submit" disabled={isPending} className="bg-blue-600 text-white px-4 py-2 rounded">
        {isPending ? "Güncelleniyor..." : "Ürünü Güncelle"}
      </button>

      {state && <div className="text-red-500">{state}</div>}
    </form>
  );
}