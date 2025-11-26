"use client";

import { useActionState, useState } from "react";
import { createBanner } from "@/actions/createBanner";
import MediaModalButton from "@/app/(frontend)/modal/MediaModalButton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Media {
  id: string;
  urls: string[];
}

export default function CreateBannerForm({
  medias,
}: {
  medias: Media[];
}) {
  const [state, formAction, isPending] = useActionState(createBanner, null);

  // ✅ Banner için TEK medya ama yine ARRAY olarak tutuyoruz (product mantığı)
  const [selectedMedias, setSelectedMedias] = useState<Media[]>([]);

  const [placement, setPlacement] = useState<"HOME" | "CATEGORY">("HOME");
  const [linkType, setLinkType] = useState<
    "NONE" | "PRODUCT" | "CATEGORY" | "BRAND" | "CUSTOM"
  >("NONE");

  return (
    <form action={formAction} className="space-y-4">
      <h1 className="text-2xl font-bold">Banner Ekle</h1>

      {/* ✅ Başlık */}
      <div>
        <Label htmlFor="title">Başlık</Label>
        <Input type="text" id="title" name="title" />
      </div>

      {/* ✅ Alt Başlık */}
      <div>
        <Label htmlFor="subtitle">Alt Başlık</Label>
        <Input type="text" id="subtitle" name="subtitle" />
      </div>

      {/* ✅ Açıklama */}
      <div>
        <Label htmlFor="description">Açıklama</Label>
        <textarea
          id="description"
          name="description"
          className="border w-full p-2 rounded"
        />
      </div>

      {/* ✅ Sıra */}
      <div>
        <Label htmlFor="order">Sıra</Label>
        <Input type="number" id="order" name="order" defaultValue={0} />
      </div>

      {/* ✅ Placement */}
      <div>
        <Label htmlFor="placement">Konum</Label>
        <select
          id="placement"
          name="placement"
          value={placement}
          onChange={(e) => setPlacement(e.target.value as any)}
          className="border px-2 py-1 rounded w-full"
        >
          <option value="HOME">Ana Sayfa</option>
          <option value="CATEGORY">Kategori</option>
        </select>
      </div>

      {/* ✅ Device */}
      <div>
        <Label htmlFor="device">Cihaz</Label>
        <select
          id="device"
          name="device"
          className="border px-2 py-1 rounded w-full"
        >
          <option value="ALL">Tümü</option>
          <option value="DESKTOP">Desktop</option>
          <option value="MOBILE">Mobile</option>
        </select>
      </div>

      {/* ✅ Link Türü */}
      <div>
        <Label htmlFor="linkType">Link Türü</Label>
        <select
          id="linkType"
          name="linkType"
          value={linkType}
          onChange={(e) => setLinkType(e.target.value as any)}
          className="border px-2 py-1 rounded w-full"
        >
          <option value="NONE">Yok</option>
          <option value="PRODUCT">Ürün</option>
          <option value="CATEGORY">Kategori</option>
          <option value="BRAND">Marka</option>
          <option value="CUSTOM">Özel URL</option>
        </select>
      </div>

      {linkType === "CUSTOM" && (
        <div>
          <Label htmlFor="linkUrl">Link URL</Label>
          <Input type="text" id="linkUrl" name="linkUrl" />
        </div>
      )}

      {/* ✅✅✅ MEDIA SECTION — PRODUCT FORM İLE BİREBİR */}
      <div className="space-y-2">
        <Label>Banner Görseli</Label>

        <MediaModalButton
          medias={medias}
          selectedMedias={selectedMedias}
          onSelectedMediasChange={(items) => {
            // ✅ SADECE 1 TANE MEDYA TUT
            setSelectedMedias(items.slice(0, 1));
          }}
        />

        {/* ✅ SADECE 1 ADET hidden mediaId gönderiyoruz */}
        {selectedMedias[0] && (
          <input type="hidden" name="mediaId" value={selectedMedias[0].id} />
        )}
      </div>

      {/* ✅ Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isPending ? "Kaydediliyor..." : "Banner Kaydet"}
      </button>

      {state && <div className="text-red-500">{state}</div>}
    </form>
  );
}
