// app/components/Favorites.tsx
import Link from "next/link";
import { Heart } from "lucide-react";
import { getSession } from "@/lib/session";

const Favorites = async () => {
  const session = await getSession(); // server-side session al
  const href = session?.user ? "/hesabim/favorilerim" : "/login"; // link belirle

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

export default Favorites;
