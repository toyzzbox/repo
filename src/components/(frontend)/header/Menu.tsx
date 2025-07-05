"use client";

import * as React from "react";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

// Tüm kategori datası:
const categories = [
  {
    name: "Oyuncaklar",
    subcategories: [

      {
        group: "Ahşap Oyuncaklar",
        items: ["Ahşap Oyuncaklar"],
      },
 

      {
        group: "Eğitici Oyuncaklar",
        items: [
          "Elektronik Öğretici Oyuncaklar",
          "Oyun Hamurları",
          "Rubik Zeka Küpü",
        ],
      },
      {
        group: "Figür Oyuncaklar",
        items: ["Hayvan Figürleri", "Karakter Figürleri"],
      },
 
    
      {
        group: "Kutu Oyuncuları",
        items: ["Çocuk Kutu Oyuncuları", "Yetişkin Kutu Oyuncuları"],
      },
      {
        group: "Müzik Aletleri",
        items: ["Müzik Aletleri"],
      },
      {
        group: "Oyuncak Arabalar",
        items: [
          "Kumandasız Arabalar",
          "Model Arabalar ve Araçlar",
          "Uzaktan Kumandalı Arabalar",
          "Yarış Pistleri",
        ],
      },
      {
        group: "Oyuncak Bebekler ve Aksesuarları",
        items: [
          "Aksesuarlar",
          "Bebekler",
          "Bez Bebekler",
          "Manken Bebekler",
        ],
      },
      {
        group: "Oyuncak Silahlar",
        items: ["Oyuncak Silahlar"],
      },
      {
        group: "Oyun Setleri",
        items: [
          "Bilim Setleri",
          "Çocuk Oyun Setleri",
          "Kız Oyun Setleri",
          "Kum ve Kinetik Kum Setleri",
        ],
      },
      {
        group: "Peluş Oyuncaklar",
        items: [
          "Hareketli Peluş Oyuncaklar",
          "Lisanslı Peluş",
          "Peluş Ayı",
          "Peluş Köpek",
          "Peluş Tavşan",
        ],
      },
      {
        group: "Puzzle",
        items: [
          "1000 Parça Puzzle",
          "1500 Parça Puzzle",
          "2000 Parça Puzzle",
          "3000 Parça Puzzle",
          "500 Parça Puzzle",
          "Ahşap Puzzle",
          "Çocuk Puzzle",
        ],
      },
      {
        group: "Yapım Oyuncakları",
        items: ["Yapım Oyuncakları"],
      },
    ],
  },
  {
    name: "Araçlar",
    subcategories: [],
  },
  {
    name: "Kırtasiye & Okul",
    subcategories: [],
  },
  {
    name: "Anne & Bebek",
    subcategories: [],
  },
  {
    name: "Pet Shop",
    subcategories: [],
  },
  {
    name: "Karakterler",
    subcategories: [],
  },
  {
    name: "Fırsatlar",
    subcategories: [],
  },
];

export default function MenuBar() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {categories.map((category) => (
          <NavigationMenuItem key={category.name}>
            <NavigationMenuTrigger>{category.name}</NavigationMenuTrigger>

            {category.subcategories.length > 0 && (
              <NavigationMenuContent>
                <div className="grid grid-cols-3 gap-6 p-6 w-[900px]">
                  {category.subcategories.map((group) => (
                    <div key={group.group}>
                      <h4 className="font-semibold mb-2">{group.group}</h4>
                      <ul className="space-y-1">
                        {group.items.map((item) => (
                          <li key={item}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={`/kategori/${slugify(item)}`}
                                className="hover:underline text-sm"
                              >
                                {item}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </NavigationMenuContent>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

// Yardımcı: basit slugify
function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/ç/g, "c")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/ğ/g, "g")
    .replace(/[^a-z0-9-]/g, "");
}
