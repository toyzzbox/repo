"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import MobileProductDetails from "./MobileProductDetails";

const DesktopProductDetails = dynamic(() => import("./DesktopProductDetails"));

interface ProductDetailsWrapperProps {
  product: any;
  relatedProducts: any[];
}

export default function ProductDetailsWrapper({
  product,
  relatedProducts,
}: ProductDetailsWrapperProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // ilk yüklemede çalıştır
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile ? (
    <MobileProductDetails product={product} relatedProducts={relatedProducts} />
  ) : (
    <DesktopProductDetails product={product} relatedProducts={relatedProducts} />
  );
}
