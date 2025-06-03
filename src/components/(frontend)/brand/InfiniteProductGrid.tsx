"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "../product/ProductCard";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  medias: { urls: string[] }[];
  group?: { name: string };
  urls?: string[];
  mediaIds?: string[];
  brands?: { name: string }[];
}

interface Props {
  brandSlug: string;
  initialSearchParams?: { [key: string]: string | string[] | undefined };
}

export function InfiniteProductGrid({ brandSlug, initialSearchParams = {} }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const getProducts = async (page: number) => {
    setLoading(true);
    const params = new URLSearchParams({ ...initialSearchParams, page: String(page) });
    const res = await fetch(`/api/brand-products?brand=${brandSlug}&${params.toString()}`);
    const data = await res.json();

    if (data.length === 0) setHasMore(false);
    else setProducts((prev) => [...prev, ...data]);
    setLoading(false);
  };

  useEffect(() => {
    getProducts(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
        !loading &&
        hasMore
      ) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => {
        const adaptedProduct = {
          ...product,
          urls: product.medias.flatMap((m) => m.urls),
        };
        return <ProductCard key={product.id} product={adaptedProduct} />;
      })}
      {loading && <p className="text-center col-span-full">Yükleniyor...</p>}
    </div>
  );
}
