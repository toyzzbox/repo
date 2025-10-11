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
import { createInvoiceAction } from "@/actions/createInvoice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function AddAddressDialog({ userId, orderId }: { userId: string; orderId: string }) {
  const [open, setOpen] = useState(false);
  const [isCorporate, setIsCorporate] = useState(false);
  const router = useRouter();

  const [addressState, addressAction, isAddressPending] = useActionState(addAddress, null);
  const [invoiceState, invoiceAction, isInvoicePending] = useActionState(createInvoiceAction, null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          + Yeni Adres Ekle
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Yeni Adres ve Fatura Ekle</DialogTitle>
        </DialogHeader>

        <form
          action={async (formData) => {
            try {
              // 1️⃣ Adres ekle
              formData.set("userId", userId);
              const addressResult = await addressAction(formData);

              if (!addressResult.success) throw new Error(addressResult.message);

              // 2️⃣ Eğer kurumsal fatura seçildiyse, fatura oluştur
              if (isCorporate) {
                formData.set("userId", userId);
                formData.set("orderId", orderId);
                formData.set("type", "CORPORATE");
                const invoiceResult = await invoiceAction(formData);

                if (!invoiceResult.success) throw new Error(invoiceResult.message);
              }

              toast.success("Adres ve fatura başarıyla kaydedildi ✅");
              setOpen(false);
              setIsCorporate(false);
              router.refresh();
            } catch (err: any) {
              toast.error(err.message || "Kaydedilemedi ❌");
            }
          }}
          className="space-y-3 mt-4"
        >
          {/* Adres Alanları */}
          <input
            name="fullName"
            placeholder="Ad Soyad"
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
            className="w-full border px-3 py-2 rounded text-sm"
          />
          <input
            name="phone"
            placeholder="Telefon"
            className="w-full border px-3 py-2 rounded text-sm"
          />

          {/* Kurumsal Fatura Seçimi */}
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

          {/* Kurumsal Alanlar */}
          {isCorporate && (
            <div className="space-y-3 pt-2 border-t">
              <h3 className="font-medium text-sm">Kurumsal Fatura Bilgileri</h3>
              <input
                name="companyName"
                placeholder="Firma Ünvanı"
                required
                className="w-full border px-3 py-2 rounded text-sm"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  name="taxOffice"
                  placeholder="Vergi Dairesi"
                  required
                  className="w-full border px-3 py-2 rounded text-sm"
                />
                <input
                  name="taxNumber"
                  placeholder="Vergi No"
                  required
                  className="w-full border px-3 py-2 rounded text-sm"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isAddressPending || isInvoicePending}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
            >
              {(isAddressPending || isInvoicePending) ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
