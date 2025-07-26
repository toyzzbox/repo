// src/app/hakkimizda/page.tsx veya contact/page.tsx

export const dynamic = "force-static";

import nextDynamic from "next/dynamic";


const ContactMap = nextDynamic(
  () => import("@/components/(frontend)/contact/ContactMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[350px] w-full bg-gray-200 flex items-center justify-center rounded-lg">
        <p className="text-gray-600 text-sm">Harita yükleniyor...</p>
      </div>
    ),
  }
);

export const metadata = {
  title: "Bize Ulaşın - Toyzz Box",
  description:
    "Toyzz Box iletişim sayfasından adres, telefon ve harita bilgilerine kolayca ulaşabilirsiniz.",
};

export default function ContactPage() {
  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
        Bize Ulaşın
      </h1>
      <ContactMap />
    </main>
  );
}
