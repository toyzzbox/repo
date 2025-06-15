"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Heart,  } from "lucide-react";
import { toggleFavorite } from "@/app/(admin)/administor/favorites/action";
import { BsFillHeartFill } from "react-icons/bs";

export function FavoriteButton({
  productId,
  isFavorited,
}: {
  productId: string;
  isFavorited: boolean;
}) {
  const [favorited, setFavorited] = useState(isFavorited);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      try {
        const res = await toggleFavorite(productId);
        setFavorited(res.status === "added");

        toast.success(
          res.status === "added"
            ? "Favorilere eklendi 💖"
            : "Favorilerden çıkarıldı 🗑️"
        );
      } catch {
        toast.error("Favorilere eklemek için giriş yapmalısınız.");
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      aria-label="Favorilere ekle/kaldır"
      className="p-2 transition hover:scale-110"
    >
      {favorited ? (
        <BsFillHeartFill className="w-6 h-6 text-red-500" />
      ) : (
        <Heart className="w-6 h-6 text-gray-600" />
      )}
    </button>
  );
}
