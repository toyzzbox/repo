'use client';

import { useGtag } from "@/lib/hooks/useGtag";

export default function GtagProvider() {
  useGtag();
  return null; // Görünür hiçbir şey render etmez
}
