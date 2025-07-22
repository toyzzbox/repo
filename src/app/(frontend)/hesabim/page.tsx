export const dynamic = "force-dynamic";
import { auth } from "@/auth"; // auth() ile sunucu taraflı kullanıcı bilgisini alıyoruz

export default async function Hesabim() {
  const session = await auth();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Merhaba, {session?.user?.name ?? "kullanıcı"} 👋</h1>

      <p className="text-gray-600">
        Hesabına hoş geldin! Buradan siparişlerini takip edebilir, adreslerini yönetebilir,
        favori ürünlerine göz atabilir ve çok daha fazlasını yapabilirsin.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <div className="bg-white p-4 rounded shadow border">
          <p className="font-medium">📦 Siparişlerim</p>
          <p className="text-sm text-gray-500">Geçmiş siparişlerini görüntüle.</p>
        </div>
        <div className="bg-white p-4 rounded shadow border">
          <p className="font-medium">❤️ Favorilerim</p>
          <p className="text-sm text-gray-500">Beğendiğin ürünleri incele.</p>
        </div>
        <div className="bg-white p-4 rounded shadow border">
          <p className="font-medium">🏠 Adreslerim</p>
          <p className="text-sm text-gray-500">Adreslerini güncelle ve yönet.</p>
        </div>
      </div>
    </div>
  );
}
