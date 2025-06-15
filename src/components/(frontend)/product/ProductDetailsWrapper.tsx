"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import MobileProductDetails from "./MobileProductDetails";

const DesktopProductDetails = dynamic(() => import("./DesktopProductDetails"));

interface ProductDetailsWrapperProps {
  product: any;
  relatedProducts: any[];
  isFavorited: boolean; // ✅ favori durumu geldi
}

export default function ProductDetailsWrapper({
  product,
  relatedProducts,
  isFavorited,
}: ProductDetailsWrapperProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // ilk render'da kontrol
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile ? (
    <MobileProductDetails
      product={product}
      relatedProducts={relatedProducts}
      isFavorited={isFavorited} // ✅ favori durumu mobil bileşene aktarıldı
    />
  ) : (
    <DesktopProductDetails
      product={product}
      relatedProducts={relatedProducts}
      isFavorited={isFavorited} // ✅ favori durumu desktop bileşene aktarıldı
    />
  );
}
