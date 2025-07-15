import GtagClient from "@/components/(frontend)/analytics/GtagClient";
import "./globals.css";
import { Metadata } from "next";
import Script from "next/script"; // ✅ Next.js Script komponenti

export const metadata: Metadata = {
  title: "Toyzz Box",
  description: "E-ticaret sitesi",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        {/* ✅ GA4 Tag */}
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
        <GtagClient/>
        {children}
      </body>
    </html>
  );
}

