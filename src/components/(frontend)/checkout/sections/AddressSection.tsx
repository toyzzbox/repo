// components/(frontend)/checkout/sections/AddressSection.tsx
import { getAddresses } from "@/actions/getAddresses";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default async function AddressSection() {
  const addresses = await getAddresses();

  if (addresses.length === 0) {
    return <p className="text-sm text-gray-500">Adres bulunamadı. Lütfen bir adres ekleyin.</p>;
  }

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Teslimat Adresi</h2>

      <RadioGroup defaultValue={addresses.find((a) => a.isDefault)?.id}>
        {addresses.map((address) => (
          <div key={address.id} className="border rounded p-3">
            <RadioGroupItem value={address.id} id={address.id} />
            <Label htmlFor={address.id} className="ml-2 cursor-pointer">
              <div className="font-medium">{address.fullName}</div>
              <div className="text-sm text-gray-600">
                {address.addressLine}, {address.district}, {address.city} {address.postalCode}
              </div>
              <div className="text-sm text-gray-500">{address.phone}</div>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </section>
  );
}
