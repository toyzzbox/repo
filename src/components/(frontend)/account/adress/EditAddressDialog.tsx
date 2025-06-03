"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { editAddress } from "@/actions/editAddress";

type Props = {
  address: {
    id: string;
    fullName: string;
    city: string;
    district: string;
    postalCode: string;
    addressLine: string;
    phone: string;
  };
};

export default function EditAddressDialog({ address }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const [formState, formAction, isPending] = useActionState(editAddress, null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full text-left px-2 py-1">
          Düzenle
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle>Adresi Düzenle</DialogTitle>
        </DialogHeader>

        <form
          action={async (formData) => {
            const result = await formAction(formData);
            if (result?.success) {
              toast.success("Adres başarıyla güncellendi");
              setOpen(false);
              router.refresh();
            } else {
              toast.error("Adres güncellenemedi");
            }
          }}
          className="space-y-3 mt-4"
        >
          <input type="hidden" name="id" value={address.id} />

          <input
            name="fullName"
            defaultValue={address.fullName}
            placeholder="Ad Soyad"
            className="w-full border px-3 py-2 rounded text-sm"
          />
          <input
            name="city"
            defaultValue={address.city}
            placeholder="Şehir"
            className="w-full border px-3 py-2 rounded text-sm"
          />
          <input
            name="district"
            defaultValue={address.district}
            placeholder="İlçe"
            className="w-full border px-3 py-2 rounded text-sm"
          />
          <input
            name="postalCode"
            defaultValue={address.postalCode}
            placeholder="Posta Kodu"
            className="w-full border px-3 py-2 rounded text-sm"
          />
          <input
            name="addressLine"
            defaultValue={address.addressLine}
            placeholder="Adres"
            className="w-full border px-3 py-2 rounded text-sm"
          />
          <input
            name="phone"
            defaultValue={address.phone}
            placeholder="Telefon"
            className="w-full border px-3 py-2 rounded text-sm"
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Güncelleniyor..." : "Güncelle"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
