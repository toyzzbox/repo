// app/admin/product-groups/AddProductGroupForm.tsx

"use client";

import { useActionState, useState } from "react";
import { createProductGroup } from "./action";

export default function AddProductGroupForm() {
  const [state, formAction, isPending] = useActionState(createProductGroup, null);
  const [name, setName] = useState("");

  return (
    <form action={formAction} className="flex gap-4 items-end">
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
