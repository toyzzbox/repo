
"use client";

import { useActionState, useState } from "react";
import { createProductGroup } from "./action";
import RichTextEditor from "@/components/(frontend)/rich-text-editor";

export default function AddProductGroupForm() {
  const [state, formAction, isPending] = useActionState(createProductGroup, null);
  const [name, setName] = useState("");
  const [descriptionHtml, setDescriptionHtml] = useState("");


  return (
    <form action={formAction} className="flex flex-col gap-4 items-end">
      <div>
        <label className="block font-medium">Grup Adı</label>
        <input
          type="text"
          name="name"
          required
          className="border rounded px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
     <label className="font-medium">Açıklama</label>
        <RichTextEditor
          description=""
          onChange={(html) => setDescriptionHtml(html)}
        />
        <input type="hidden" name="description" value={descriptionHtml} />

      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        {isPending ? "Ekleniyor..." : "Grup Ekle"}
      </button>

      {state && <p className="text-red-500">{state}</p>}
    </form>
  );
}
