"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import MobileProductDetails from "./MobileProductDetails";

const DesktopProductDetails = dynamic(() => import("./DesktopProductDetails"));

export default function ProductDetailsWrapper({ product }: { product: any }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // ilk yüklemede çalıştır
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile ? (
    <MobileProductDetails product={product} />
  ) : (
    <DesktopProductDetails product={product} />
  );
}
