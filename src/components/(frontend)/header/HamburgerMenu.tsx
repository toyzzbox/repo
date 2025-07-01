"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HamburgerMenu() {
  const [activeMenu, setActiveMenu] = useState<"main" | "ciltBakimi">("main");
  const router = useRouter();

  return (
    <Sheet>
      <SheetTrigger className="p-2 border">Menüyü Aç</SheetTrigger>

      <SheetContent side="left" className="p-0 w-[320px]">
        {activeMenu === "main" && (
          <div>
            <div className="flex justify-between items-center p-4 border-b font-bold text-lg">
              <span>SEPHORA</span>
              <button onClick={() => console.log("Kapat")}>✕</button>
            </div>

            <div className="border-b p-4">Hesabım</div>

            <div
              className="border-b p-4 flex items-center cursor-pointer"
              onClick={() => router.push("/giris")}
            >
              <span className="mr-2">👤</span> Giriş yap
            </div>

            <div
              className="border-b p-4 flex items-center cursor-pointer"
              onClick={() => router.push("/favoriler")}
            >
              <span className="mr-2">🤍</span> Favorilerim
            </div>

            <div
              className="border-b p-4 flex items-center cursor-pointer"
              onClick={() => router.push("/siparis-takibi")}
            >
              <span className="mr-2">📦</span> Sipariş takibi
            </div>

            <div
              className="border-b p-4 flex justify-between items-center cursor-pointer"
              onClick={() => setActiveMenu("ciltBakimi")}
            >
              <span>Kategoriler</span>
              <ChevronRight size={20} />
            </div>

            <div className="border-b p-4">Büyük İndirim</div>
            <div className="border-b p-4">Güneş Bakım</div>
            <div className="border-b p-4">En Yeniler</div>
            <div className="border-b p-4 text-pink-600 font-medium">
              Sephora Collection
            </div>
          </div>
        )}

        {activeMenu === "ciltBakimi" && (
          <div>
            <div className="flex items-center p-4 border-b font-bold text-lg">
              <button onClick={() => setActiveMenu("main")} className="mr-2">
                <ChevronLeft size={20} />
              </button>
              <span>Cilt Bakımı</span>
            </div>

            <div className="border-b p-4">Tümünü Gör</div>
            <div className="border-b p-4">Çok Satanlar</div>
            <div className="border-b p-4">K-Beauty</div>
            <div className="border-b p-4">Bakım Türü</div>
            <div className="border-b p-4">Yüz Maskesi</div>
            <div className="border-b p-4">Tıraş</div>
            <div className="border-b p-4">Makyaj Temizleyici ve Arındırıcı</div>
            <div className="border-b p-4">Erkek Yüz Bakımı</div>
            <div className="border-b p-4">Yüz Bakım Ürünleri</div>
            <div className="border-b p-4">Endişeye Göre</div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
