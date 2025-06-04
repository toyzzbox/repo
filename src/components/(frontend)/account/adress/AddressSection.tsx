"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Address } from "@/types/address";

type Props = {
  addresses: Address[];
  selectedAddressId: string | null;
  onSelectAddress: (id: string) => void;
};

export default function AddressSection({ addresses, selectedAddressId, onSelectAddress }: Props) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Teslimat Adresi</h2>

      <RadioGroup value={selectedAddressId || ""} onValueChange={onSelectAddress} className="space-y-4">
        {addresses.map((address) => (
          <Card key={address.id}>
            <CardHeader className="flex justify-between">
              <div className="flex items-center gap-2">
                <RadioGroupItem value={address.id} />
                <CardTitle className="text-base">{address.fullName}</CardTitle>
              </div>
              {address.isDefault && <Badge>Varsayılan</Badge>}
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-1 pl-7">
              <p>{address.addressLine}</p>
              <p>{`${address.district}, ${address.city} ${address.postalCode}`}</p>
              <p>{address.phone}</p>
            </CardContent>
          </Card>
        ))}
      </RadioGroup>

      <div className="pt-4">
        <Button variant="outline">+ Yeni Adres Ekle</Button>
      </div>
    </section>
  );
}
