// app/not-found.tsx
'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Lottie from "lottie-react";

export default function NotFound() {
  const animationUrl = "/animations/404.json"; // public klasöründen alınır

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-background text-foreground">
      <div className="w-96 h-96">
        <Lottie path={animationUrl} loop autoplay />
      </div>

      <h1 className="text-3xl font-bold mt-6">Sayfa Bulunamadı</h1>
      <p className="text-muted-foreground mt-2 text-center max-w-md">
        Aradığınız sayfa bulunamadı. Lütfen adresi kontrol edin veya ana sayfaya dönün.
      </p>

      <Button asChild className="mt-6">
        <Link href="/">Ana Sayfaya Dön</Link>
      </Button>
    </div>
  );
}
