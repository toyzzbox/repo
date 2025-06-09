"use client";

import { useState, useTransition } from "react";
import RichTextEditor from "@/app/(admin)/administor/ui/RichTextEditor";
import { updateProductGroup } from "@/app/(admin)/administor/product-group/updateProductGroup";

interface ProductGroup {
  id: string;
  name: string;
  description?: string;
  serial?: string;
}

interface EditProductGroupFormProps {
  group: ProductGroup;
}

export default function EditProductGroupForm({ group }: EditProductGroupFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(group.name);
  const [descriptionHtml, setDescriptionHtml] = useState(group.description ?? "");
  const [serial, setSerial] = useState(group.serial ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append("id", group.id);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("serial", serial);

    startTransition(async () => {
      const result = await updateProductGroup(null, formData);
      if (result) setError(result);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg mx-auto px-2">
      <h1 className="text-xl font-bold mb-4">Ürün Grubunu Güncelle</h1>

      <label className="font-medium">Grup Adı</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Grup Adı"
        className="py-2 px-3 border rounded"
        required
      />

<label className="font-medium">Açıklama</label>
<RichTextEditor
  description="descriptionHtml"
  onChange={(html) => {
    setDescriptionHtml(html);
  }}
/>
<input type="hidden" name="description" value={descriptionHtml} />

      <label className="font-medium">Seri</label>
      <input
        type="text"
        value={serial}
        onChange={(e) => setSerial(e.target.value)}
        placeholder="Seri"
        className="py-2 px-3 border rounded"
      />

      <button
        disabled={isPending}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
      >
        {isPending ? "Güncelleniyor..." : "Güncelle"}
      </button>

      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
