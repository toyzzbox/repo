"use client";

import { useActionState } from "react";
import { createProduct } from "./action";






export default function ProductForm() {
  const [error, action, isPending] = useActionState(createProduct, null);

  return (
    <main className="mx-auto max-w-lg">
      <h1>Ürün Yönetim Sayfası</h1>
      <form action={action} method="POST" className="flex flex-col px-2 gap-3">
        <input 
          type="text" 
          name="name" 
          placeholder="Ürün Adı" 
          className="py-2 px-3 rounded-sm" 
          required 
        />
        deneme
  
        <input 
          type="text" 
          name="description" 
          placeholder="Açıklama" 
          className="py-2 px-3 rounded-sm" 
          required 
        />
        <input 
          type="number" 
          name="price" 
          placeholder="Fiyat" 
          className="py-2 px-3 rounded-sm" 
          required 
        />

 

        <button disabled={isPending} className="bg-blue-500 text-white py-2 px-3">
          {isPending ? "Gönderiliyor..." : "Gönder"}
        </button>

        {error && <p className="text-red-500">{error}</p>}
      </form>
    </main>
  );
}
