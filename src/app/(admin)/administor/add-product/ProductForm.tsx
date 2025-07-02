"use client";

import { useActionState, useState } from "react";
import { createProduct } from "./action";
import RichTextEditor from "@/components/(frontend)/rich-text-editor";
import MediaModalButton from "@/app/(frontend)/modal/MediaModalButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

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

      <div className="space-y-2">
        <Label htmlFor="name">Ürün Adı</Label>
        <Input id="name" name="name" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="serial">Seri Numarası (opsiyonel)</Label>
        <Input id="serial" name="serial" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="stock">Stok</Label>
        <Input id="stock" name="stock" type="number" min={0} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Fiyat</Label>
        <Input id="price" name="price" type="number" step="0.01" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="discount">İndirim (%)</Label>
        <Input
          id="discount"
          name="discount"
          type="number"
          min={0}
          max={100}
          defaultValue={0}
        />
      </div>

      <div className="space-y-2">
        <Label>Ürün Grubu (opsiyonel)</Label>
        <Select name="groupId">
          <SelectTrigger>
            <SelectValue placeholder="— Grupsuz Ürün —" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">— Grupsuz Ürün —</SelectItem>
            {productGroups.map((group) => (
              <SelectItem key={group.id} value={group.id}>
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Açıklama</Label>
        <RichTextEditor onChange={setDescriptionHtml} />
        <input type="hidden" name="description" value={descriptionHtml} />
      </div>

      {/* Marka ve Kategori multiple select için react-select tavsiye edilir. */}

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

      <Button type="submit" disabled={isPending}>
        {isPending ? "Kaydediliyor..." : "Ürünü Kaydet"}
      </Button>

      {state && <div className="text-red-500">{state}</div>}
    </form>
  );
}
