"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import MobileProductDetails from "./MobileProductDetails";

// Desktop bileşenini client tarafında dinamik yükle
const DesktopProductDetails = dynamic(
  () => import("./DesktopProductDetails"),
  { ssr: false },
);

interface ProductDetailsWrapperProps {
  product: any;
  relatedProducts: any[];
  isFavorited: boolean;
  comments: any[];      // 👈 yorumlar da geliyor
}

export default function ProductDetailsWrapper({
  product,
  relatedProducts,
  isFavorited,
  comments,
}: ProductDetailsWrapperProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();                           // ilk render’da kontrol
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile ? (
    <MobileProductDetails
      product={product}
      relatedProducts={relatedProducts}
      isFavorited={isFavorited}
      comments={comments}                   // ✅ mobil bileşene
    />
  ) : (
    <DesktopProductDetails
      product={product}
      relatedProducts={relatedProducts}
      isFavorited={isFavorited}
      comments={comments}                   // ✅ masaüstü bileşene
    />
  );
}
