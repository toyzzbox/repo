"use client";

import { addComment } from "@/actions/comments/addComment";
import { useActionState } from "react";

const initialState = { message: null };

interface Props {
  productId: string;
}

export default function CommentForm({ productId }: Props) {
  const [state, formAction, isPending] = useActionState(addComment, initialState);

  return (
    <form action={formAction} className="space-y-4 mt-6">
      <h3 className="text-lg font-semibold">Yorum Ekle</h3>

      <input type="hidden" name="productId" value={productId} />

      <textarea
        name="content"
        className="w-full border p-2 rounded"
        placeholder="Yorumunuzu yazın..."
        required
        disabled={isPending}
      />
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Puan:</label>
        <select
          name="rating"
          className="border p-1 rounded"
          defaultValue={5}
          disabled={isPending}
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {state.message && <p className="text-red-500 text-sm">{state.message}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isPending ? "Gönderiliyor..." : "Gönder"}
      </button>
    </form>
  );
}
