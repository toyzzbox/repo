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
  const [menuStack, setMenuStack] = useState<Category[]>([]);
  const router = useRouter();

  const currentMenu = menuStack[menuStack.length - 1];
  const currentCategories = currentMenu ? currentMenu.children : categories;

  const handleCategoryClick = (category: Category) => {
    if (category.children.length > 0) {
      setMenuStack((prev) => [...prev, category]);
    } else {
      router.push(`/category/${category.slug}`);
    }
  };

  const handleBack = () => {
    setMenuStack((prev) => prev.slice(0, -1));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="lg" className="md:hidden">
          <Menu className="text-2xl" />
          <span className="sr-only">Menüyü Aç</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[80%] max-w-xs h-screen overflow-y-auto">
        
        <div>
          <div className="p-4 font-bold text-lg border-b flex items-center">
            {menuStack.length > 0 && (
              <button onClick={handleBack} className="mr-2">
                <ChevronLeft size={20} />
              </button>
            )}
            <span>{currentMenu ? currentMenu.name : "TOYZZ BOX"}</span>
          </div>

          {currentCategories.map((category) => (
            <div
              key={category.id}
              className="border-b p-4 flex justify-between items-center cursor-pointer"
              onClick={() => handleCategoryClick(category)}
            >
              <span>{category.name}</span>
              {category.children.length > 0 && <ChevronRight size={20} />}
            </div>
          ))}

          {menuStack.length === 0 && (
            <div className="border-b p-4 text-pink-600 font-medium">Fırsatlar</div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
