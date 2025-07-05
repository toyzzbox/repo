"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

// Oyuncak kategorileri ve alt kategorileri
const oyuncakKategorileri = [
  {
    title: "Oyuncak Arabalar",
    href: "/oyuncaklar/arabalar",
    description: "Uzaktan kumandalı arabalar, metal arabalar ve daha fazlası",
  },
  {
    title: "Oyuncak Bebekler",
    href: "/oyuncaklar/bebekler",
    description: "Bebek oyuncakları, aksesuarları ve bakım setleri",
  },
  {
    title: "Lego & Yapı Blokları",
    href: "/oyuncaklar/lego",
    description: "Lego setleri, yapı blokları ve inşaat oyuncakları",
  },
  {
    title: "Eğitici Oyuncaklar",
    href: "/oyuncaklar/egitici",
    description: "Zeka geliştiren, öğretici ve eğlendirici oyuncaklar",
  },
  {
    title: "Peluş Oyuncaklar",
    href: "/oyuncaklar/pelus",
    description: "Yumuşak peluş oyuncaklar ve sevimli karakterler",
  },
  {
    title: "Puzzle & Bulmaca",
    href: "/oyuncaklar/puzzle",
    description: "Yaş grubuna uygun puzzle ve bulmaca oyunları",
  },
  {
    title: "Oyuncak Silahlar",
    href: "/oyuncaklar/silahlar",
    description: "Su tabancaları, Nerf silahları ve güvenli oyuncak silahlar",
  },
  {
    title: "Müzik Oyuncakları",
    href: "/oyuncaklar/muzik",
    description: "Müzik aletleri, sesli oyuncaklar ve ritim oyuncakları",
  },
]

// Diğer kategoriler için genel içerik (mevcut components array'i)
const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description: "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description: "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description: "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description: "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description: "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
]

export function MenuBar() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {/* Oyuncaklar kategorisi - dinamik alt kategoriler */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Oyuncaklar</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[1000px] lg:grid-cols-2 bg-white">
              {oyuncakKategorileri.map((kategori) => (
                <ListItem 
                  key={kategori.title} 
                  title={kategori.title} 
                  href={kategori.href}
                >
                  {kategori.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Diğer Menü Kalemleri */}
        {["Anne & Bebek", "Spor & Outdoor", "Hediyelik", "Elektronik", "Okul & Kırtasiye", "Fırsatlar"].map(
          (menuTitle) => (
            <NavigationMenuItem key={menuTitle}>
              <NavigationMenuTrigger>{menuTitle}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[1000px] lg:grid-cols-2 bg-white">
                  {components.map((component) => (
                    <ListItem key={component.title} title={component.title} href={component.href}>
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          )
        )}

        <NavigationMenuItem>
          <Link href="/markalar" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Markalar
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground bg-white",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";