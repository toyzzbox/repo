"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteAddress } from "@/actions/deleteAddress";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DeleteAddressDialog({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      const success = await deleteAddress(id);
      if (success) {
        toast.success("Adres silindi");
        setOpen(false);
        router.refresh();
      } else {
        toast.error("Adres silinemedi");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full text-left text-red-600 px-2 py-1">
          Sil
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adresi Sil</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600 mb-4">
          Bu adresi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Vazgeç
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
            {isPending ? "Siliniyor..." : "Sil"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
