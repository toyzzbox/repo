"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Category = {
  id: string;
  name: string;
  slug: string;
  children: Category[];
};

interface HamburgerMenuProps {
  categories: Category[];
}

export default function HamburgerMenu({ categories }: HamburgerMenuProps) {
  const [activeMenu, setActiveMenu] = useState<"main" | string>("main");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
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
            <div className="p-4 font-bold text-lg border-b">TOYZZ BOX</div>

            {/* Dinamik kategoriler */}
            {categories.map((category) => (
              <div
                key={category.id}
                className="border-b p-4 flex justify-between items-center cursor-pointer"
                onClick={() => {
                  if (category.children.length > 0) {
                    setSelectedCategory(category);
                    setActiveMenu(category.slug);
                  } else {
                    router.push(`/category/${category.slug}`);
                  }
                }}
              >
                <span>{category.name}</span>
                {category.children.length > 0 && <ChevronRight size={20} />}
              </div>
            ))}

            <div className="border-b p-4 text-pink-600 font-medium">Fırsatlar</div>
          </div>
        )}

        {/* Alt Kategori Menü */}
        {activeMenu !== "main" && selectedCategory && (
          <div>
            <div className="flex items-center p-4 border-b font-bold text-lg">
              <button onClick={() => setActiveMenu("main")} className="mr-2">
                <ChevronLeft size={20} />
              </button>
              <span>{selectedCategory.name}</span>
            </div>

            {selectedCategory.children.map((sub) => (
              <div
                key={sub.id}
                className="border-b p-4 cursor-pointer"
                onClick={() => router.push(`/category/${sub.slug}`)}
              >
                {sub.name}
              </div>
            ))}
          </div>
        )}

      </SheetContent>
    </Sheet>
  );
}
