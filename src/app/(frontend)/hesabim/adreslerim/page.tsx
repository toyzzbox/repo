import { getAddresses } from "@/actions/getAddresses";
import AddressCard from "@/components/(frontend)/account/AddressCard";
import AddAddressDialog from "@/components/(frontend)/account/AddAddressDialog";

export const dynamic = "force-dynamic"; // ✅ kritik satır!

export default async function Adreslerim() {
  const addresses = await getAddresses();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Adreslerim</h1>
        <AddAddressDialog />
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
