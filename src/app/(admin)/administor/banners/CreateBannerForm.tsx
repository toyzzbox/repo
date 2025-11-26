"use client";

import { useFormState } from "react-dom";
import { Button } from "@/components/ui/button";
import BannerMediaPicker from "./BannerMediaPicker";
import { createBanner } from "@/actions/createBanner";
import { useState } from "react";

export default function CreateBannerForm() {
  const [state, formAction] = useFormState(createBanner, null);

  const [media, setMedia] = useState<any>(null);
  const [placement, setPlacement] = useState<"HOME" | "CATEGORY">("HOME");
  const [linkType, setLinkType] = useState<
    "NONE" | "PRODUCT" | "CATEGORY" | "BRAND" | "CUSTOM"
  >("NONE");

  return (
    <form action={formAction} className="max-w-2xl space-y-6 bg-white p-6 rounded-xl shadow">
      {/* ✅ Hata */}
      {state && <div className="text-red-500 text-sm">{state}</div>}

      <input name="title" placeholder="Başlık" className="border p-2 w-full" />
      <input name="subtitle" placeholder="Alt Başlık" className="border p-2 w-full" />
      <textarea name="description" placeholder="Açıklama" className="border p-2 w-full" />

      <input
        type="number"
        name="order"
        defaultValue={0}
        className="border p-2 w-full"
        placeholder="Sıra"
      />

      {/* ✅ Placement */}
      <select
        name="placement"
        className="border p-2 w-full"
        value={placement}
        onChange={(e) => setPlacement(e.target.value as any)}
      >
        <option value="HOME">Ana Sayfa</option>
        <option value="CATEGORY">Kategori</option>
      </select>

      {/* ✅ Device */}
      <select name="device" className="border p-2 w-full">
        <option value="ALL">Tümü</option>
        <option value="DESKTOP">Desktop</option>
        <option value="MOBILE">Mobile</option>
      </select>

      {/* ✅ Link Type */}
      <select
        name="linkType"
        className="border p-2 w-full"
        value={linkType}
        onChange={(e) => setLinkType(e.target.value as any)}
      >
        <option value="NONE">Yok</option>
        <option value="PRODUCT">Ürün</option>
        <option value="CATEGORY">Kategori</option>
        <option value="BRAND">Marka</option>
        <option value="CUSTOM">Özel URL</option>
      </select>

      {linkType === "CUSTOM" && (
        <input
          name="linkUrl"
          className="border p-2 w-full"
          placeholder="/kampanya/black-friday"
        />
      )}

      {/* ✅ Banner Görsel Seçici */}
      <BannerMediaPicker value={media} onChange={setMedia} />

      {/* ✅ Media gizli input */}
      {media && <input type="hidden" name="mediaId" value={media.id} />}

      <Button type="submit">Banner Kaydet</Button>
    </form>
  );
}
