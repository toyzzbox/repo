"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useActionState } from "react";
import { addAddress } from "@/actions/addAddress";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner"; // ✅ ekle

export default function AddAddressDialog() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [formState, formAction, isPending] = useActionState(addAddress, null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-black text-white px-4 py-2 rounded bg-white hover:bg-gray-800">
          + Yeni Adres Ekle
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yeni Adres Ekle</DialogTitle>
        </DialogHeader>

        <form
          action={async (formData) => {
            await formAction(formData);
            toast.success("Adres başarıyla eklendi ✅"); // 🎉
            setOpen(false);
            router.refresh();
          }}
          className="space-y-3 mt-4"
        >
          <input name="fullName" placeholder="Ad Soyad" required className="w-full border px-3 py-2 rounded text-sm" />
          <input name="city" placeholder="Şehir" required className="w-full border px-3 py-2 rounded text-sm" />
          <input name="district" placeholder="İlçe" required className="w-full border px-3 py-2 rounded text-sm" />
          <input name="postalCode" placeholder="Posta Kodu" required className="w-full border px-3 py-2 rounded text-sm" />
          <input name="addressLine" placeholder="Adres" required className="w-full border px-3 py-2 rounded text-sm" />
          <input name="phone" placeholder="Telefon" required className="w-full border px-3 py-2 rounded text-sm" />

          <div className="flex justify-end">
            <button type="submit" disabled={isPending} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
              {isPending ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
