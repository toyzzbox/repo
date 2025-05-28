

"use client"

import { useActionState } from "react";
import { createCategory } from "./action";

interface Category {
  id: string;
  name: string;
}



interface Media {
  id: string;
  urls: string[];
}

interface CategoryFormProps {
  categories: Category[];
  medias: Media[];

}






export default function CategoryForm({ categories , medias}: CategoryFormProps) {
  const [error, action, isPending] = useActionState(createCategory, null);

  return (
    <main className="mx-auto max-w-lg">
      <h1>Categori Sayfası</h1>
      <form action={action} className="flex flex-col px-2 gap-3">
        <input type="text" name="name" placeholder="deneme" className="py-2 px-3 rounded-sm" />
        <input type="text" name="slug" placeholder="slug" className="py-2 px-3 rounded-sm" />
        <input type="text" name="description" placeholder="acıklama" className="py-2 px-3 rounded-sm" />
        <select name="parentId" className="py-2 px-3 rounded-sm">
          <option value="">Select Parent Category</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>

        <label className="font-medium">Medya Dosyaları</label>
        <select name="mediaIds[]" multiple className="py-2 px-3 border rounded">
          {medias.map((media) => (
            <option key={media.id} value={media.id}>
              {media.urls[0]?.slice(-40) || "Media"}
            </option>
          ))}
        </select>
       

        <button disabled={isPending} className="bg-blue-500 text-white py-2 px-3">
          {isPending ? "Submitting..." : "Submit"}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </main>
  );
}