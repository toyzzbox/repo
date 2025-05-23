"use client";

import { uploadMediaAction } from "@/actions/media";
import { useActionState } from "react";

type UploadMediaResult =
  | { error: string; url?: undefined }
  | { url: string; error: null };

export default function MediaForm() {
  const [state, formAction, isPending] = useActionState<UploadMediaResult, FormData>(
    uploadMediaAction,
    { error: "", url: undefined }
  );

  return (
    <main className="mx-auto max-w-lg">
      <h1 className="text-xl font-bold mb-4">Medya Yükle</h1>

      <form action={formAction} className="flex flex-col gap-4" encType="multipart/form-data">
        <input
          type="file"
          name="file"
          accept="image/*,video/*"
          className="py-2 px-3 border rounded"
          required
        />

        <button
          disabled={isPending}
          className="bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          {isPending ? "Yükleniyor..." : "Gönder"}
        </button>

        {state?.error && <p className="text-red-500">{state.error}</p>}
        {state?.url && (
          <img
            src={state.url}
            alt="Yüklenen Medya"
            className="max-w-xs border rounded mt-4"
          />
        )}
      </form>
    </main>
  );
}
