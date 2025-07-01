"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import CategoryFilters from "@/components/(frontend)/category/CategoryFilters";

interface Props {
  subcategories: any[];
  brands: any[];
  attributeGroups: any[];
}

export default function MobileFilterButton({
  subcategories,
  brands,
  attributeGroups,
}: Props) {
  return (
    <div className="lg:hidden sticky top-0 z-20 bg-white border-b">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full rounded-none py-4">
            Filtrele
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-sm sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Filtrele</DialogTitle>
          </DialogHeader>

          <CategoryFilters
            subcategories={subcategories}
            brands={brands}
            attributeGroups={attributeGroups}
          />

          {/* İsteğe bağlı: Kapat butonu */}
          {/* 
          <Button onClick={() => setIsOpen(false)} className="w-full mt-4">
            Kapat
          </Button>
          */}
        </DialogContent>
      </Dialog>
    </div>
  );
}
