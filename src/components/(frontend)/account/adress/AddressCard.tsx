"use client";

import { MoreVertical, Star } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import EditAddressDialog from "./EditAddressDialog";
import DeleteAddressDialog from "./DeleteAddressDialog";
import { setDefaultAddress } from "@/actions/setDefaultAddress";
                                                                                                                                      
type Address = {
  id: string;
  fullName: string;
  city: string;
  district: string;
  postalCode: string;
  addressLine: string;
  phone: string;
  isDefault: boolean;
};

export default function AddressCard({ address }: { address: Address }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSetDefault = () => {
    startTransition(async () => {
      const success = await setDefaultAddress(address.id);
      if (success) {
        toast.success("Adres varsayılan olarak ayarlandı");
        router.refresh();
      } else {
        toast.error("İşlem başarısız");
      }
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">{address.fullName}</h3>
          {address.isDefault && (
            <Badge variant="default" className="mt-1 text-xs">
              <Star className="w-3 h-3 mr-1" /> Varsayılan
            </Badge>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {!address.isDefault && (
              <DropdownMenuItem onClick={handleSetDefault}>
                Varsayılan Yap
              </DropdownMenuItem>
            )}
            <EditAddressDialog address={address} />
            <DeleteAddressDialog id={address.id} />
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="text-sm space-y-1 text-muted-foreground">
        <p>{address.addressLine}</p>
        <p>{`${address.district}, ${address.city} ${address.postalCode}`}</p>
        <p>{address.phone}</p>
      </CardContent>

      <CardFooter className="text-xs text-gray-400">
        ID: {address.id}
      </CardFooter>
    </Card>
  );
}


