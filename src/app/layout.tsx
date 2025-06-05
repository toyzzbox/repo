import "@/globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Toyzz Box Oyuncak",
  description: "Oyuncak Adına Her Şey",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Tailwind test divi */}
        <div className="bg-red-500 text-white p-4">Tailwind ÇALIŞIYOR 🎉</div>
        {children}
      </body>
    </html>
  );
}
