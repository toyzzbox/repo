// src/app/contact/page.tsx
import { Metadata } from 'next';
import nextDynamic from "next/dynamic";
export const dynamic = "force-static";

// Optimized dynamic import with better loading component
const ContactMap = nextDynamic(
  () => import("@/components/(frontend)/contact/ContactMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[350px] w-full bg-gray-200 animate-pulse flex items-center justify-center rounded-lg">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-gray-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Harita yükleniyor...</p>
        </div>
      </div>
    ),
  }
);

// Enhanced metadata
export const metadata: Metadata = {
  title: "Bize Ulaşın - Toyzz Box",
  description: "Toyzz Box iletişim sayfasından adres, telefon ve harita bilgilerine kolayca ulaşabilirsiniz.",
  keywords: "Toyzz Box, iletişim, adres, telefon, harita",
  openGraph: {
    title: "Bize Ulaşın - Toyzz Box",
    description: "Toyzz Box iletişim sayfasından adres, telefon ve harita bilgilerine kolayca ulaşabilirsiniz.",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <main className="max-w-5xl mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800">
          Bize Ulaşın
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Bizimle iletişime geçmek için aşağıdaki bilgileri kullanabilirsiniz.
        </p>
      </header>

      <section>
        <ContactMap />
      </section>
    </main>
  );
}