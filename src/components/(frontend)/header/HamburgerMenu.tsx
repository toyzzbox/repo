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
} from "@/components/ui/sheet"; // ✅ SheetTitle eklendi

type SubCategory = {
  title: string;
  href: string;
};

type Category = {
  title: string;
  icon?: string;
  subCategories: SubCategory[];
};

const menuItems: Category[] = [
  {
    title: "Oyuncaklar",
    icon: "💻",
    subCategories: [
      { title: "Telefonlar", href: "/elektronik/telefonlar" },
      { title: "Bilgisayarlar", href: "/elektronik/bilgisayarlar" },
      { title: "Tabletler", href: "/elektronik/tabletler" },
    ],
  },
  {
    title: "Anne & Bebek",
    subCategories: [
      { title: "Erkek", href: "/giyim/erkek" },
      { title: "Kadın", href: "/giyim/kadin" },
      { title: "Çocuk", href: "/giyim/cocuk" },
    ],
  },
  {
    title: "Spor & Bebek",
    subCategories: [
      { title: "Erkek", href: "/giyim/erkek" },
      { title: "Kadın", href: "/giyim/kadin" },
      { title: "Çocuk", href: "/giyim/cocuk" },
    ],
  },
  {
    title: "Okul & Kırtasiye",
    subCategories: [
      { title: "Mobilya", href: "/ev-yasam/mobilya" },
      { title: "Mutfak", href: "/ev-yasam/mutfak" },
      { title: "Dekorasyon", href: "/ev-yasam/dekorasyon" },
    ],
  },
  {
    title: "Hediyelik",
    subCategories: [
      { title: "Fitness", href: "/spor/fitness" },
      { title: "Outdoor", href: "/spor/outdoor" },
      { title: "Takım Sporları", href: "/spor/takim-sporlari" },
    ],
  },
  {
    title: "Elektronik",
    subCategories: [
      { title: "Fitness", href: "/spor/fitness" },
      { title: "Outdoor", href: "/spor/outdoor" },
      { title: "Takım Sporları", href: "/spor/takim-sporlari" },
    ],
  },
  {
    title: "Markalar",
    subCategories: [
      { title: "Fitness", href: "/spor/fitness" },
      { title: "Outdoor", href: "/spor/outdoor" },
      { title: "Takım Sporları", href: "/spor/takim-sporlari" },
    ],
  },
  {
    title: "Fırsatlar",
    subCategories: [
      { title: "Fitness", href: "/spor/fitness" },
      { title: "Outdoor", href: "/spor/outdoor" },
      { title: "Takım Sporları", href: "/spor/takim-sporlari" },
    ],
  },
];

const CategoryItem = ({ item }: { item: Category }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full mb-2"
    >
      <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md">
        <div className="flex items-center gap-2">
          <span className="font-medium">{item.title}</span>
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-16 h-16 p-0">
            {isOpen ? <ChevronDown size={24} /> : <ChevronRight size={16} />}
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <div className="pl-10 py-2 space-y-2">
          {item.subCategories.map((subCategory, index) => (
            <a
              key={index}
              href={subCategory.href}
              className="block text-gray-600 hover:text-black hover:bg-gray-50 rounded-md p-2"
            >
              {subCategory.title}
            </a>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

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
        {/* ✅ Görünür ve erişilebilir başlık */}
        <SheetTitle className="text-xl font-bold px-4 pb-4">
          Toyzzbox
        </SheetTitle>

        <div className="py-6">
          <div className="mt-6 px-2">
            <Link href="/login">
              <Button variant="outline" className="w-full">
                Giriş Yap
              </Button>
            </Link>
          </div>
          <div className="space-y-1">
            {menuItems.map((item, index) => (
              <CategoryItem key={index} item={item} />
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
