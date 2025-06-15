import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProductCard } from "@/components/(frontend)/product/ProductCard";

export default async function FavoritesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return redirect("/login");
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Favori Ürünlerim</h1>

      {favorites.length === 0 ? (
        <p className="text-muted-foreground">Henüz favori ürününüz yok.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {favorites.map((fav) => (
            <ProductCard key={fav.product.id} product={fav.product} />
          ))}
        </div>
      )}
    </main>
  );
}
