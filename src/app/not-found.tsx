// app/not-found.tsx
'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react"; // Opsiyonel ikon

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-background text-foreground transition-colors">
      <div className="text-center max-w-xl">
        <h1 className="text-[80px] font-bold text-red-600 dark:text-red-400 leading-none">404</h1>
        <h2 className="text-2xl font-semibold mt-4">Sayfa Bulunamadı</h2>
        <p className="mt-2 text-muted-foreground">
          Aradığınız sayfa bulunamadı. Adres yanlış yazılmış olabilir ya da içerik kaldırılmış olabilir.
        </p>

        <div className="mt-6">
          <Button asChild>
            <Link href="/">Ana Sayfaya Dön</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
