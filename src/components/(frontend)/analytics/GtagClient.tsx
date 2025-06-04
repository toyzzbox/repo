'use client';

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function GtagClient() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + (searchParams.toString() ? `?${searchParams}` : "");
    window.gtag?.("config", "G-8P7CCYJ18M", {
      page_path: url,
    });
  }, [pathname, searchParams]);

  return null;
}
