import "../globals.css"; // 🌟 BURASI ZORUNLU! 🌟
import Footer from "@/components/(frontend)/footer/Footer";
import Header from "@/components/(frontend)/header/Header";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import PageContainer from "@/components/(frontend)/container/PageContainer";
import { Toaster } from "sonner";
import GtagClient from "@/components/(frontend)/analytics/GtagClient";
import MobileFooter from "@/components/(frontend)/footer/MobileFooter";

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GtagClient />
      <ReduxProvider>
        <Toaster position="top-right" richColors />
        <div className="flex flex-col min-h-screen overflow-x-hidden w-full">
          <Header />
          <main className="flex-1 w-full overflow-x-hidden">
            <PageContainer>{children}</PageContainer>
          </main>
          <footer className="w-full">
            <Footer />
            <MobileFooter />
          </footer>
        </div>
      </ReduxProvider>
    </>
  );
}