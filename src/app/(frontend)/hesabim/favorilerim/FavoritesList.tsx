'use client';

import { useState, useTransition } from 'react';
import { ProductCard } from "@/components/(frontend)/product/ProductCard";
import { toast } from 'sonner'; // veya kullandığınız toast library
import { removeFavoriteById } from './action';

interface Media {
  id: string;
  url: string;
  type: string;
}

interface ProductMedia {
  id: string;
  media: Media;
}

interface Brand {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  slug: string;
  description?: string;
  medias: ProductMedia[];
  brands: Brand;
  // diğer product özellikleri...
}

interface FavoritesListProps {
  initialProducts: Product[];
  userId: string;
}

export default function FavoritesList({ initialProducts, userId }: FavoritesListProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const handleRemoveFavorite = async (productId: string) => {
    // Bu ürün için loading state'i başlat
    setRemovingIds(prev => new Set([...prev, productId]));

    // Optimistic update - UI'dan hemen kaldır
    const originalProducts = [...products];
    setProducts(prev => prev.filter(product => product.id !== productId));

    startTransition(async () => {
      try {
        const result = await removeFavoriteById(productId);
        
        if (!result.success) {
          // Hata durumunda geri ekle
          setProducts(originalProducts);
          toast.error(result.message || 'Favorilerden çıkarılırken hata oluştu');
        } else {
          toast.success('Ürün favorilerden çıkarıldı');
        }
      } catch (error) {
        // Hata durumunda geri ekle
        setProducts(originalProducts);
        toast.error('Bir hata oluştu');
      } finally {
        // Loading state'i temizle
        setRemovingIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      }
    });
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">💔</div>
        <h2 className="text-xl font-semibold mb-2">Henüz favori ürününüz yok</h2>
        <p className="text-muted-foreground mb-6">
          Beğendiğiniz ürünleri favorilerinize ekleyerek daha sonra kolayca bulabilirsiniz.
        </p>
        <a 
          href="/products" 
          className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Ürünleri Keşfet
        </a>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 text-sm text-muted-foreground">
        {products.length} favori ürün
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((product) => {
          const isRemoving = removingIds.has(product.id);
          
          return (
            <div key={product.id} className="relative group">
              <div className={`transition-opacity ${isRemoving ? 'opacity-50' : ''}`}>
                <ProductCard product={product} />
              </div>
              
              {/* Remove button */}
              <button
                onClick={() => handleRemoveFavorite(product.id)}
                disabled={isRemoving || isPending}
                className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 disabled:opacity-50 shadow-lg"
                title="Favorilerden çıkar"
              >
                {isRemoving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>

              {/* Kalp ikonu - favoride olduğunu göstermek için */}
              <div className="absolute top-2 left-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                ❤️
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
