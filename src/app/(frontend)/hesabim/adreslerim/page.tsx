// app/account/addresses/page.tsx

import { getAddresses } from "@/actions/getAddresses";
import AddressCard from "@/components/(frontend)/account/AddressCard";


export default async function Adreslerim() {
  const addresses = await getAddresses();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Adreslerim</h1>
        <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          + Yeni Adres Ekle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.length === 0 ? (
          <p>Henüz kayıtlı bir adresiniz yok.</p>
        ) : (
          addresses.map((address) => (
            <AddressCard key={address.id} address={address} />
          ))
        )}
      </div>
    </div>
  );
}
