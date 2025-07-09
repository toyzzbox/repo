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
  LocationEdit,
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

      <SheetContent side="left" className="w-[80%] max-w-xs h-screen overflow-y-auto">
        
        {/* Ana Menü */}
        {activeMenu === "main" && (
          <div>
            <div className="flex justify-between items-center p-4 border-b font-bold text-lg">
              <span>TOYZZ BOX</span>
            </div>

            <div className="border-b p-4">Hesabım</div>

            <div
              className="border-b p-4 flex items-center cursor-pointer"
              onClick={() => router.push("/giris")}
            >
              <User className="mr-2" /> Giriş yap
            </div>

            <div
              className="border-b p-4 flex items-center cursor-pointer"
              onClick={() => router.push("/favoriler")}
            >
              <Heart className="mr-2" /> Favorilerim
            </div>

            <div
              className="border-b p-4 flex items-center cursor-pointer"
              onClick={() => router.push("/siparis-takibi")}
            >
              <BoxIcon className="mr-2" /> Sipariş takibi
            </div>

            {/* Kategoriler */}
            {[
              "Oyuncaklar",
              "Anne & Bebek",
              "Spor & Outdoor",
              "Okul & Kırtasiye",
              "Hediyelik",
              "Elektronik",
            ].map((category) => (
              <div
                key={category}
                className="border-b p-4 flex justify-between items-center cursor-pointer"
                onClick={() => setActiveMenu("ciltBakimi")} // TODO: her kategori için farklı menu state setle
              >
                <span>{category}</span>
                <ChevronRight size={20} />
              </div>
            ))}

            <div className="border-b p-4">Markalar</div>
            <div className="border-b p-4 text-pink-600 font-medium">Fırsatlar</div>

            {/* Diğerleri */}
            <div className="border-b p-4">Diğerleri</div>

            <div
              className="border-b p-4 flex items-center cursor-pointer"
              onClick={() => router.push("/magazalar")}
            >
              <LocationEdit className="mr-2" /> Mağazalar
            </div>
            <div
              className="border-b p-4 flex items-center cursor-pointer"
              onClick={() => router.push("/yardim")}
            >
              <LocationEdit className="mr-2" /> Yardım
            </div>
            <div
              className="border-b p-4 flex items-center cursor-pointer"
              onClick={() => router.push("/iletisim")}
            >
              <LocationEdit className="mr-2" /> İletişim
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

            {["Yüz Bakım Ürünleri", "Göz Bakımı", "Vücut Bakımı"].map((item) => (
              <div
                key={item}
                className="border-b p-4 flex justify-between items-center cursor-pointer"
                onClick={() => setActiveMenu("yuzBakimUrunleri")}
              >
                <span>{item}</span>
                <ChevronRight size={20} />
              </div>
            ))}

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

            {["Serumlar", "Nemlendiriciler", "Göz Kremleri", "Tonikler", "Peelingler"].map((sub) => (
              <div key={sub} className="border-b p-4">
                {sub}
              </div>
            ))}
          </div>
        )}

      </SheetContent>
    </Sheet>
  );
}
