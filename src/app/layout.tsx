import "./globals.css";
import GtagClient from "@/components/(frontend)/analytics/GtagClient";
import { SessionProvider } from "next-auth/react";
import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Toyzz Box",
  description: "E-ticaret sitesi",
  icons: {
    icon: "/favicon.ico?v=3",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        {/* ✅ GA4 Script Etiketi */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8P7CCYJ18M"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-8P7CCYJ18M');
          `}
        </Script>
      </head>
      <body>
        <SessionProvider> {/* ✅ Oturumu tüm app'e yayar */}
          <GtagClient />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
