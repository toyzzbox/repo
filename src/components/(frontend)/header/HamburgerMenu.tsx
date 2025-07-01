"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

/* ----------- Types ----------- */

type Category = {
  title: string;
  href?: string;
  subCategories?: Category[]; // recursive yapı
};

/* ----------- Sample Data ----------- */

const menuItems: Category[] = [
  {
    title: "Oyuncaklar",
    subCategories: [
      {
        title: "Oyuncak Arabalar",
        subCategories: [
          { title: "Kumandalı Arabalar", href: "/oyuncaklar/arabalar/kumandali" },
          { title: "Model Arabalar", href: "/oyuncaklar/arabalar/model" },
        ],
      },
      { title: "Peluşlar", href: "/oyuncaklar/pelus" },
    ],
  },
  {
    title: "Anne & Bebek",
    subCategories: [
      { title: "Bebek Arabaları", href: "/anne-bebek/bebek-arabalari" },
      { title: "Bebek Bakımı", href: "/anne-bebek/bebek-bakimi" },
    ],
  },
];

/* ----------- Recursive CategoryItem Component ----------- */

const CategoryItem = ({ category }: { category: Category }) => {
  const [isOpen, setIsOpen] = useState(false);

  const hasSubCategories = category.subCategories && category.subCategories.length > 0;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full mb-2">
      <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md">
        {category.href ? (
          <Link href={category.href} className="font-medium block w-full">
            {category.title}
          </Link>
        ) : (
          <span className="font-medium">{category.title}</span>
        )}

        {hasSubCategories && (
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
              {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={16} />}
            </Button>
          </CollapsibleTrigger>
        )}
      </div>

      {hasSubCategories && (
        <CollapsibleContent>
          <div className="pl-4 py-2 space-y-1">
            {category.subCategories!.map((sub, idx) => (
              <CategoryItem key={idx} category={sub} />
            ))}
          </div>
        </CollapsibleContent>
      )}
    </Collapsible>
  );
};

/* ----------- MobileSidebar Component ----------- */

const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="lg" className="md:hidden">
          <Menu className="text-2xl" />
          <span className="sr-only">Menüyü Aç</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[80%] max-w-xs">
        <SheetTitle className="text-xl font-bold px-4 pb-4">Toyzzbox</SheetTitle>

        <div className="py-6">
          <div className="mt-6 px-2">
            <Link href="/login">
              <Button variant="outline" className="w-full">
                Giriş Yap
              </Button>
            </Link>
          </div>

          <div className="space-y-1 mt-4">
            {menuItems.map((category, index) => (
              <CategoryItem key={index} category={category} />
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
