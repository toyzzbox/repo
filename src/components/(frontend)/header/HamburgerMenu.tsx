"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  BoxIcon,
  ChevronLeft,
  ChevronRight,
  Heart,
  Menu,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HamburgerMenu() {
  const [activeMenu, setActiveMenu] = useState<"main" | "ciltBakimi" | "yuzBakimUrunleri">("main");
  const router = useRouter();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="lg" className="md:hidden">
          <Menu className="text-2xl" />
          <span className="sr-only">Menüyü Aç</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[80%] max-w-xs">
        {/* Ana Menü */}
        {activeMenu === "main" && (
          <div>
            <div className="flex justify-between items-center p-4 border-b font-bold text-lg">
              <span>TOYZZ BOX</span>
              <button onClick={() => console.log("Kapat")}>✕</button>
            </div>

            <div className="border-b p-4">Hesabım</div>

            <div
              className="border-b p-4 flex items-center cursor-pointer"
              onClick={() => router.push("/giris")}
            >
              <span className="mr-2"><User /></span> Giriş yap
            </div>

            <div
              className="border-b p-4 flex items-center cursor-pointer"
              onClick={() => router.push("/favoriler")}
            >
              <span className="mr-2"><Heart /></span> Favorilerim
            </div>

            <div
              className="border-b p-4 flex items-center cursor-pointer"
              onClick={() => router.push("/siparis-takibi")}
            >
              <span className="mr-2"><BoxIcon /></span> Sipariş takibi
            </div>

            <div
              className="border-b p-4 flex justify-between items-center cursor-pointer"
              onClick={() => setActiveMenu("ciltBakimi")}
            >
              <span>Oyuncaklar</span>
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

        {/* 2. Seviye Menü - Cilt Bakımı */}
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

            <div
              className="border-b p-4 flex justify-between items-center cursor-pointer"
              onClick={() => setActiveMenu("yuzBakimUrunleri")}
            >
              <span>Yüz Bakım Ürünleri</span>
              <ChevronRight size={20} />
            </div>

            <div className="border-b p-4">Endişeye Göre</div>
          </div>
        )}

        {/* 3. Seviye Menü - Yüz Bakım Ürünleri Alt Kategorileri */}
        {activeMenu === "yuzBakimUrunleri" && (
          <div>
            <div className="flex items-center p-4 border-b font-bold text-lg">
              <button onClick={() => setActiveMenu("ciltBakimi")} className="mr-2">
                <ChevronLeft size={20} />
              </button>
              <span>Yüz Bakım Ürünleri</span>
            </div>

            <div className="border-b p-4">Serumlar</div>
            <div className="border-b p-4">Nemlendiriciler</div>
            <div className="border-b p-4">Göz Kremleri</div>
            <div className="border-b p-4">Tonikler</div>
            <div className="border-b p-4">Peelingler</div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
