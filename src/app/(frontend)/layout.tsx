import Footer from "@/components/(frontend)/footer/Footer";
import Header from "@/components/(frontend)/header/Header";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import PageContainer from "@/components/(frontend)/container/PageContainer";
import "../globals.css";
import { Toaster } from "sonner";
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


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ReduxProvider>
        <Toaster position="top-right" richColors /> 
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              <PageContainer>{children}</PageContainer>
            </main>
            <footer>
              <Footer />
      
            </footer>
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}
