// app/hesabim/addresses/page.tsx

import { getAddresses } from "@/actions/getAddresses";
import AddAddressDialog from "@/components/(frontend)/account/adress/AddAddressDialog";
import AddressCard from "@/components/(frontend)/account/adress/AddressCard";
import { HomeIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Adreslerim() {
  const addresses = await getAddresses();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Adreslerim</h1>
          <p className="text-sm text-muted-foreground">
            Teslimat adreslerinizi burada yönetebilirsiniz.
          </p>
        </div>
        <AddAddressDialog />
      </div>

      {addresses.length === 0 ? (
        <div className="flex items-center gap-4 bg-muted p-6 rounded-md border text-muted-foreground">
          <HomeIcon className="w-6 h-6" />
          Henüz bir adres eklemediniz.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <AddressCard key={address.id} address={address} />
          ))}
        </div>
      )}
    </div>
  );
}
