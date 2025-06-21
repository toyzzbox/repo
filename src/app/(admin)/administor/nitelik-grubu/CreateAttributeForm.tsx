"use client";

import { useActionState } from "react";
import { createAttribute } from "./action";

interface CreateAttributeGroup {
  id: string;
  name: string;
}


export default function CreateAttributeGroup() {
  const [state, formAction] = useActionState(createAttribute, null);

  return (
    <main className="mx-auto max-w-lg">
      <h1>Nitelik Ekle</h1>
      <form action={formAction} method="POST" className="flex flex-col px-2 gap-3">
        <input 
          type="text" 
          name="name" 
          placeholder="Nitelik Adı (örn. Erkek, Kız, Unisex)" 
          className="py-2 px-3 rounded-sm" 
          required 
        />
       


        <button type="submit" className="bg-blue-500 text-white py-2 px-3">
          Gönder
        </button>

        {state && <p className="text-red-500">{state}</p>} {/* Hata mesajı */}
      </form>
    </main>
  );
}
