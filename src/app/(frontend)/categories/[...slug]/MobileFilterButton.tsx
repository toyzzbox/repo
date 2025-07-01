"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Filter } from "lucide-react"; // Filtre ikonu

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
          <Button
            variant="outline"
            className="w-full rounded-none py-4 flex items-center justify-center gap-2"
          >
            <Filter className="w-5 h-5" />
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
        </DialogContent>
      </Dialog>
    </div>
  );
}
