// app/403/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
      <div className="text-center space-y-6">
        <h1 className="text-7xl font-bold text-red-600">403</h1>
        <h2 className="text-2xl font-semibold text-gray-800">Erişim Reddedildi</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Bu sayfayı görüntülemek için gerekli izinlere sahip değilsiniz. Eğer bunun bir hata olduğunu düşünüyorsanız, lütfen bizimle iletişime geçin.
        </p>
        <Button asChild>
          <Link href="/">Ana Sayfaya Dön</Link>
        </Button>
      </div>
    </div>
  );
}
