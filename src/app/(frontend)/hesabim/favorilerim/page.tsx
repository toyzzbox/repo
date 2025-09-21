import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getUserFavorites } from "./action";
import FavoritesList from "./FavoritesList";

export default async function FavoritesPage() {
  const session = await getSession();
  
  if (!session) {
    redirect("/login");
  }

  const favoriteProducts = await getUserFavorites();

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Favori Ürünlerim</h1>
      <FavoritesList 
        initialProducts={favoriteProducts} 
        userId={session.user.id} 
      />
    </main>
  );
}

