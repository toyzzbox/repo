"use client";

import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getAddresses } from "@/actions/getAddresses";
import { Address } from "@/types/address";

export default function AddressSection() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    getAddresses().then((data) => {
      setAddresses(data);
      const defaultAddress = data.find((addr) => addr.isDefault);
      setSelected(defaultAddress?.id || null);
    });
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Teslimat Adresi</h2>

      {addresses.length === 0 ? (
        <p>Henüz kayıtlı bir adresiniz yok.</p>
      ) : (
        <RadioGroup value={selected || ""} onValueChange={setSelected}>
          {addresses.map((address) => (
            <div key={address.id} className="border rounded p-3 space-y-1">
              <Label className="flex items-center space-x-2">
                <RadioGroupItem value={address.id} />
                <span>{address.fullName} - {address.addressLine}</span>
              </Label>
              <p className="text-sm text-muted-foreground">
                {address.city}, {address.district} {address.postalCode} - {address.phone}
              </p>
            </div>
          ))}
        </RadioGroup>
      )}

      <div className="pt-2">
        <Button variant="outline">+ Yeni Adres Ekle</Button>
      </div>
    </div>
  );
}
