"use client";

import { useOptimistic, useTransition } from "react";
import { toggleFavorite } from "@/actions/favorite";
import { BsHeartFill } from "react-icons/bs";
import { Heart } from "lucide-react";
import { toast } from "sonner";

interface FavoriteButtonProps {
  productId: string;
  initialIsFavorite: boolean;
}

export function FavoriteButton({ productId, initialIsFavorite }: FavoriteButtonProps) {
  const [isPending, startTransition] = useTransition();

  const [optimisticFavorite, setOptimisticFavorite] = useOptimistic(
    initialIsFavorite,
    (_state, newValue: boolean) => newValue
  );

  const handleClick = () => {
    startTransition(async () => {
      setOptimisticFavorite(!optimisticFavorite);

      try {
        const res = await toggleFavorite(productId);
        setOptimisticFavorite(res.status === "added");
      } catch {
        setOptimisticFavorite(initialIsFavorite);
        toast.error("Favorilere eklemek için giriş yapmalısınız.");
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="p-2 rounded-full hover:bg-red-100 transition"
      aria-label="Favorilere ekle/kaldır"
    >
      {optimisticFavorite ? (
        <BsHeartFill className="w-6 h-6 text-red-500" />
      ) : (
        <Heart className="w-6 h-6 text-gray-500" />
      )}
    </button>
  );
}
