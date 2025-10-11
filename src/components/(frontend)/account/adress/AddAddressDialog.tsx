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
import { toast } from "sonner";

export default function AddAddressDialog() {
  const [open, setOpen] = useState(false);
  const [isCorporate, setIsCorporate] = useState(false);
  const router = useRouter();
  const [formState, formAction, isPending] = useActionState(addAddress, null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          + Yeni Adres Ekle
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Yeni Adres Ekle</DialogTitle>
        </DialogHeader>
        <form
          action={async (formData) => {
            await formAction(formData);
            toast.success("Adres başarıyla eklendi ✅");
            setOpen(false);
            setIsCorporate(false);
            router.refresh();
          }}
          className="space-y-3 mt-4"
        >
          <input
            name="fullName"
            placeholder="Ad Soyad"
            required
            className="w-full border px-3 py-2 rounded text-sm"
          />
          <input
            name="city"
            placeholder="Şehir"
            required
            className="w-full border px-3 py-2 rounded text-sm"
          />
          <input
            name="district"
            placeholder="İlçe"
            required
            className="w-full border px-3 py-2 rounded text-sm"
          />
          <input
            name="postalCode"
            placeholder="Posta Kodu"
            required
            className="w-full border px-3 py-2 rounded text-sm"
          />
          <input
            name="addressLine"
            placeholder="Adres"
            required
            className="w-full border px-3 py-2 rounded text-sm"
          />
          <input
            name="phone"
            placeholder="Telefon"
            required
            className="w-full border px-3 py-2 rounded text-sm"
          />

          {/* Kurumsal Fatura Seçeneği */}
          <div className="pt-2">
            <p className="text-sm font-medium mb-2">Kurumsal fatura mı istiyorsunuz?</p>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="invoiceType"
                  value="no"
                  checked={!isCorporate}
                  onChange={() => setIsCorporate(false)}
                  className="cursor-pointer"
                />
                <span className="text-sm">Hayır</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="invoiceType"
                  value="yes"
                  checked={isCorporate}
                  onChange={() => setIsCorporate(true)}
                  className="cursor-pointer"
                />
                <span className="text-sm">Evet</span>
              </label>
            </div>
          </div>

          {/* Kurumsal Fatura Bilgileri */}
          {isCorporate && (
            <div className="space-y-3 pt-2 border-t">
              <h3 className="font-medium text-sm">Kurumsal Fatura Bilgileri</h3>
              <input
                name="companyName"
                placeholder="Firma Ünvanı"
                required={isCorporate}
                className="w-full border px-3 py-2 rounded text-sm"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  name="taxOffice"
                  placeholder="Vergi Dairesi"
                  required={isCorporate}
                  className="w-full border px-3 py-2 rounded text-sm"
                />
                <input
                  name="taxNumber"
                  placeholder="Vergi No / T.C. No"
                  required={isCorporate}
                  className="w-full border px-3 py-2 rounded text-sm"
                />
                      <input
                  name="taxOffice"
                  placeholder="Şehir"
                  required={isCorporate}
                  className="w-full border px-3 py-2 rounded text-sm"
                />
                <input
                  name="taxNumber"
                  placeholder="İlçe"
                  required={isCorporate}
                  className="w-full border px-3 py-2 rounded text-sm"
                />
                   <input
                  name="taxNumber"
                  placeholder="Mahalle"
                  required={isCorporate}
                  className="w-full border px-3 py-2 rounded text-sm"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
            >
              {isPending ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}