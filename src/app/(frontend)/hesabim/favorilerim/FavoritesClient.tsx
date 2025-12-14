"use client";

import FavoritesList from "./FavoritesList";

export default function FavoritesClient({
  initialProducts,
  userId,
}: {
  initialProducts: any[];
  userId: string;
}) {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Favori Ürünlerim</h1>

      <FavoritesList initialProducts={initialProducts} userId={userId} />
    </main>
  );
}
