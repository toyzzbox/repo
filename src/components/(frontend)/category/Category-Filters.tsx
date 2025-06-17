// components/category-filters.tsx
'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


export function CategoryFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    
    if (value) {
      currentParams.set(key, value);
    } else {
      currentParams.delete(key);
    }

    // Sayfayı yenilemeden URL'yi güncelle
    router.replace(`${pathname}?${currentParams.toString()}`, { scroll: false });
  };

  const handleSortChange = (value: string) => {
    handleFilterChange('sort', value);
  };

  const priceRange = {
    min: searchParams.get('minPrice') || '',
    max: searchParams.get('maxPrice') || '',
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filtreler</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto gap-1">
              <SlidersHorizontal className="h-4 w-4" />
              Sırala
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleSortChange('price-asc')}>
              Fiyat: Düşükten Yükseğe
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSortChange('price-desc')}>
              Fiyat: Yüksekten Düşüğe
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSortChange('newest')}>
              En Yeniler
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSortChange('name-asc')}>
              İsme Göre (A-Z)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {searchParams.size > 0 && (
          <Button
            variant="ghost"
            onClick={() => router.push(pathname)}
            className="ml-2"
          >
            Filtreleri Temizle
          </Button>
        )}
      </div>



      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="minPrice">Minimum Fiyat</Label>
          <Input
            id="minPrice"
            type="number"
            placeholder="₺0"
            value={priceRange.min}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="maxPrice">Maksimum Fiyat</Label>
          <Input
            id="maxPrice"
            type="number"
            placeholder="₺10000"
            value={priceRange.max}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}