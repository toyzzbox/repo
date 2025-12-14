import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getUserFavorites } from "./action";
import FavoritesClient from "./FavoritesClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function FavoritesPage() {
  let session: any = null;

  try {
    session = await getSession();
  } catch (e) {
    console.error("getSession failed:", e);
    session = null;
  }

  if (!session) {
    redirect("/login");
  }

  let favoriteProducts: any[] = [];
  try {
    favoriteProducts = await getUserFavorites();
  } catch (e) {
    console.error("getUserFavorites failed:", e);
    favoriteProducts = [];
  }

  return (
    <Suspense fallback={null}>
      <FavoritesClient
        initialProducts={JSON.parse(JSON.stringify(favoriteProducts))}
        userId={session.user.id}
      />
    </Suspense>
  );
}
