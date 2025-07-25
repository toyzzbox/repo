import "../globals.css"; // 🌟 BURASI ZORUNLU! 🌟
import Footer from "@/components/(frontend)/footer/Footer";
import Header from "@/components/(frontend)/header/Header";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import PageContainer from "@/components/(frontend)/container/PageContainer";
import { Toaster } from "sonner";
import GtagClient from "@/components/(frontend)/analytics/GtagClient";

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GtagClient /> {/* sadece bu client */}
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
    </>
  );
}
