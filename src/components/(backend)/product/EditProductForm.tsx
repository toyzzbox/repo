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

// Güncellenecek ürün bilgilerini içeren interface
interface Product {
  id: string;
  name: string;
  serial?: string;
  stock: number;
  price: number;
  discount?: number;
  groupId?: string;
  description?: string;
  brandIds: string[];
  categoryIds: string[];
  mediaIds: string[];
}

interface ProductUpdateFormProps {
  product: Product; // Mevcut ürün bilgileri
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
  
  // Mevcut ürün bilgileri ile state'leri initialize et
  const [descriptionHtml, setDescriptionHtml] = useState(product.description || "");
  const [selectedMedias, setSelectedMedias] = useState<Media[]>(
    medias.filter(media => product.mediaIds.includes(media.id))
  );
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(product.categoryIds);
  const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>(product.brandIds);

  return (
    <form action={formAction} className="space-y-4">
      <h1 className="text-2xl font-bold">Ürün Güncelle</h1>

      {/* Ürün ID'si hidden input olarak gönderilir */}
      <input type="hidden" name="id" value={product.id} />

      {/* Ürün Adı */}
      <div>
        <Label htmlFor="name">Ürün Adı</Label>
        <Input 
          type="text" 
          id="name" 
          name="name" 
          required 
          defaultValue={product.name}
        />
      </div>

      {/* Seri Numarası */}
      <div>
        <Label htmlFor="serial">Seri Numarası (opsiyonel)</Label>
        <Input 
          type="text" 
          id="serial" 
          name="serial" 
          defaultValue={product.serial || ""}
        />
      </div>

      {/* Stok */}
      <div>
        <Label htmlFor="stock">Stok</Label>
        <Input 
          type="number" 
          id="stock" 
          name="stock" 
          required 
          min={0} 
          defaultValue={product.stock}
        />
      </div>

      {/* Fiyat */}
      <div>
        <Label htmlFor="price">Fiyat</Label>
        <Input 
          type="number" 
          step="0.01" 
          id="price" 
          name="price" 
          required 
          defaultValue={product.price}
        />
      </div>

      {/* İndirim */}
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

      {/* Ürün Grubu */}
      <div>
        <Label htmlFor="groupId">Ürün Grubu (opsiyonel)</Label>
        <select 
          id="groupId" 
          name="groupId" 
          className="border px-2 py-1 rounded w-full"
          defaultValue={product.groupId || ""}
        >
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
          initialContent={product.description || ""}
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

      {/* MultiSelect Brand */}
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

      {/* Media */}
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
        {isPending ? "Güncelleniyor..." : "Ürünü Güncelle"}
      </button>

      {state && <div className="text-red-500">{state}</div>}
    </form>
  );
}