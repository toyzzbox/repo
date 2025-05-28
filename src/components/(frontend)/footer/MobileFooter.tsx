"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

export default function MobileFooter() {
  return (
    <div className="block md:hidden px-4 py-6 bg-gray-100 border-t">
      <Accordion type="single" collapsible className="w-full space-y-2">
        {/* Tüm Kategoriler */}
        <AccordionItem value="categories">
          <AccordionTrigger className="font-semibold text-left">
            Tüm Kategoriler
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col space-y-2 font-medium text-sm">
              <Link href="/">Oyuncaklar</Link>
              <Link href="/">Anne &amp; Bebek</Link>
              <Link href="/">Spor & Outdoor</Link>
              <Link href="/">Okul & Kırtasiye</Link>
              <Link href="/">Fırsatlar</Link>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Popüler Markalar */}
        <AccordionItem value="brands">
          <AccordionTrigger className="font-semibold text-left">
            Popüler Markalar
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col space-y-2 font-medium text-sm">
              <Link href="/">Lego</Link>
              <Link href="/">Fisher-Price</Link>
              <Link href="/">Hot Wheels</Link>
              <Link href="/">Barbie</Link>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Hakkımızda */}
        <AccordionItem value="about">
          <AccordionTrigger className="font-semibold text-left">
            Hakkımızda
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col space-y-2 font-medium text-sm">
              <Link href="/kurumsal">Kurumsal</Link>
              <Link href="/iletisim">İletişim</Link>
              <Link href="/kariyer">Kariyer</Link>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
