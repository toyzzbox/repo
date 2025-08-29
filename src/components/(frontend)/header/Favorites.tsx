"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

const Favorites = () => {
  return (
    <Link
      href="/favorites"
      className="relative cursor-pointer flex items-center"
    >
      <div className="text-3xl">
        <Heart />
      </div>
      <span className="ml-2">Favorilerim</span>
    </Link>
  );
};

export default Favorites;
