"use client";

import { createComment } from "@/actions/comments/createComment";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface CommentFormProps {
  productId: string;
  onSuccess?: () => void;
}

export default function CommentForm({ productId, onSuccess }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Yorum boş olamaz");
      return;
    }

    startTransition(async () => {
      try {
        const res = await createComment(productId, content, rating);
        if (res?.status === "success") {
          toast.success("Yorumunuz gönderildi");
          setContent("");
          setRating(5);
          onSuccess?.();
        } else {
          toast.error(res?.message ?? "Bir hata oluştu");
        }
      } catch (err) {
        toast.error("Giriş yapmalısınız");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        className="w-full border p-3 rounded resize-none"
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Yorumunuzu yazın..."
      />

      <div className="flex items-center gap-4">
        <label className="text-sm">Puan:</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border px-2 py-1 rounded"
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} / 5
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded"
      >
        Gönder
      </button>
    </form>
  );
}
