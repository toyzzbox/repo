import "./globals.css";
import GtagClient from "@/components/(frontend)/analytics/GtagClient";

import { Metadata } from "next";
import Script from "next/script";
import { SessionProvider } from "./contexts/SessionContext";

export const metadata: Metadata = {
  title: "Toyzz Box",
  description: "Oyuncak Adına Herşey",
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
        <GtagClient />
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}