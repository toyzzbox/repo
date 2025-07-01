"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";

interface CategoryFiltersProps {
  subcategories?: { id: string; name: string; _count?: { products: number } }[];
  brands?: { slug: string; name: string }[];
  attributeGroups?: {
    id: string;
    name: string;
    attributes: { id: string; name: string }[];
  }[];
}

export default function CategoryFilters({
  subcategories = [],
  brands = [],
  attributeGroups = [],
}: CategoryFiltersProps) {
  const router = useRouter();
  const params = useSearchParams();

  const toggleMulti = (key: string, value: string) => {
    const url = new URL(window.location.href);
    const values = new Set(url.searchParams.getAll(key));
    values.has(value) ? values.delete(value) : values.add(value);
    url.searchParams.delete(key);
    values.forEach((v) => url.searchParams.append(key, v));
    router.push("?" + url.searchParams.toString());
  };

  const setSingle = (key: string, value: string | null) => {
    const url = new URL(window.location.href);
    value ? url.searchParams.set(key, value) : url.searchParams.delete(key);
    router.push("?" + url.searchParams.toString());
  };

  return (
    <aside className="mb-8 space-y-6">
      <Accordion type="multiple" defaultValue={["subcategories", "brands", "price", "attributes"]}>
        {/* ALT KATEGORİLER */}
        {subcategories.length > 0 && (
          <AccordionItem value="subcategories">
            <AccordionTrigger>Alt Kategoriler</AccordionTrigger>
            <AccordionContent>
              {subcategories.map((c) => (
                <div key={c.id} className="flex items-center gap-2 mb-1">
                  <Checkbox
                    checked={params.getAll("category").includes(c.id)}
                    onCheckedChange={() => toggleMulti("category", c.id)}
                    id={`category-${c.id}`}
                  />
                  <label htmlFor={`category-${c.id}`} className="text-sm">
                    {c.name}
                    {c._count?.products ? ` (${c._count.products})` : ""}
                  </label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        )}

        {/* MARKALAR */}
        {brands.length > 0 && (
          <AccordionItem value="brands">
            <AccordionTrigger>Markalar</AccordionTrigger>
            <AccordionContent>
              {brands.map((b) => (
                <div key={b.slug} className="flex items-center gap-2 mb-1">
                  <Checkbox
                    checked={params.getAll("brand").includes(b.slug)}
                    onCheckedChange={() => toggleMulti("brand", b.slug)}
                    id={`brand-${b.slug}`}
                  />
                  <label htmlFor={`brand-${b.slug}`} className="text-sm">
                    {b.name}
                  </label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        )}

        {/* FİYAT ARALIĞI SLIDER */}
        <AccordionItem value="price">
          <AccordionTrigger>Fiyat Aralığı</AccordionTrigger>
          <AccordionContent>
            <Slider
              defaultValue={[
                Number(params.get("minPrice") ?? 0),
                Number(params.get("maxPrice") ?? 10000),
              ]}
              min={0}
              max={10000}
              step={10}
              onValueCommit={(values) => {
                setSingle("minPrice", String(values[0]));
                setSingle("maxPrice", String(values[1]));
              }}
            />
            <div className="flex justify-between text-sm mt-2">
              <span>{params.get("minPrice") ?? 0} TL</span>
              <span>{params.get("maxPrice") ?? 10000} TL</span>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* ATTRIBUTE GRUPLARI */}
        {attributeGroups.length > 0 && (
          attributeGroups.map((g) => (
            <AccordionItem value={`attr-${g.id}`} key={g.id}>
              <AccordionTrigger>{g.name}</AccordionTrigger>
              <AccordionContent>
                {g.attributes.map((a) => (
                  <div key={a.id} className="flex items-center gap-2 mb-1">
                    <Checkbox
                      checked={params.getAll("attribute").includes(a.id)}
                      onCheckedChange={() => toggleMulti("attribute", a.id)}
                      id={`attr-${a.id}`}
                    />
                    <label htmlFor={`attr-${a.id}`} className="text-sm">
                      {a.name}
                    </label>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))
        )}
      </Accordion>

      <Separator />

      {/* RESET BUTONU */}
      <Button variant="outline" onClick={() => router.push(window.location.pathname)} className="w-full">
        Filtreleri Temizle
      </Button>
    </aside>
  );
}
