// components/(frontend)/header/FavoritesClient.tsx
"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

interface FavoritesClientProps {
  session: any; // Session tipinizi buraya koyun
}

const FavoritesClient = ({ session }: FavoritesClientProps) => {
  const href = session?.user ? "/hesabim/favorilerim" : "/login";

  return (
    <Link
      href={href}
      className="relative flex items-center cursor-pointer"
      aria-label={session?.user ? "Favorilerim" : "Giriş yap"}
    >
      <div className="text-3xl">
        <Heart />
      </div>
      <span className="ml-2">Favorilerim</span>
    </Link>
  );
};

export default FavoritesClient;