"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const categories = [
  {
    title: "Oyuncak Arabalar",
    href: "/docs/toys/cars",
    subcategories: [
      {
        title: "Uzaktan Kumandalı Arabalar",
        href: "/docs/toys/remote-control-cars",
        subcategories: [
          {
            title: "Off-road",
            href: "/docs/toys/remote-control-cars/off-road",
          },
          {
            title: "Racing Cars",
            href: "/docs/toys/remote-control-cars/racing",
          },
        ],
      },
      {
        title: "Klasik Arabalar",
        href: "/docs/toys/classic-cars",
      },
    ],
  },
  {
    title: "Oyuncak Bebekler",
    href: "/docs/toys/dolls",
  },
  {
    title: "Diğer Oyuncaklar",
    href: "/docs/toys/other",
  },
];

export function MenuBar() {
  const renderSubcategories = (subcategories: typeof categories) => {
    return (
      <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[1000px] lg:grid-cols-[.75fr_1fr] bg-white">
        {subcategories.map((subcategory) => (
          <li key={subcategory.title}>
            <ListItem title={subcategory.title} href={subcategory.href}>
              {subcategory.subcategories && renderSubcategories(subcategory.subcategories)}
            </ListItem>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Oyuncaklar</NavigationMenuTrigger>
          <NavigationMenuContent>{renderSubcategories(categories)}</NavigationMenuContent>
        </NavigationMenuItem>

        {/* Diğer Menü Kalemleri */}
        {["Anne & Bebek", "Spor & Outdoor", "Hediyelik", "Elektronik", "Okul & Kırtasiye", "Fırsatlar"].map(
          (menuTitle) => (
            <NavigationMenuItem key={menuTitle}>
              <NavigationMenuTrigger>{menuTitle}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[1000px] lg:grid-cols-[.75fr_1fr] bg-white">
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
        {children && <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>}
      </a>
    </NavigationMenuLink>
  );
});
ListItem.displayName = "ListItem";
