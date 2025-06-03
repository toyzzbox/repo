import { getAddresses } from "@/actions/getAddresses";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AddressSection() {
  const addresses = await getAddresses();

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Teslimat Adresi</h2>

      {addresses.length === 0 ? (
        <p>Henüz adres eklenmemiş.</p>
      ) : (
        addresses.map((address) => (
          <Card key={address.id}>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="text-base">{address.fullName}</CardTitle>
              {address.isDefault && <Badge>Varsayılan</Badge>}
            </CardHeader>
            <CardContent className="text-sm text-gray-600 space-y-1">
              <p>{address.addressLine}</p>
              <p>{`${address.district}, ${address.city} ${address.postalCode}`}</p>
              <p>{address.phone}</p>
            </CardContent>
          </Card>
        ))
      )}

      <div className="pt-4">
        <Button variant="outline">Yeni Adres Ekle</Button>
      </div>
    </section>
  );
}

        </RadioGroup>
      )}

      <div className="pt-2">
        <Button variant="outline">+ Yeni Adres Ekle</Button>
      </div>
    </div>
  );
}
