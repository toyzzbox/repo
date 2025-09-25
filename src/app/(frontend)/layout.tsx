import "../globals.css";
import Footer from "@/components/(frontend)/footer/Footer";
import Header from "@/components/(frontend)/header/Header";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import PageContainer from "@/components/(frontend)/container/PageContainer";
import { Toaster } from "sonner";
import GtagClient from "@/components/(frontend)/analytics/GtagClient";
import MobileFooter from "@/components/(frontend)/footer/MobileFooter";
import { getSession } from "@/lib/session";
import { getAllCategories } from "@/actions/getHamburgerCategories"; // BURAYI EKLEYİN

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const categories = await getAllCategories(); // BURAYI EKLEYİN
  
  return (
    <>
      <GtagClient />
      <ReduxProvider>
        <Toaster position="top-right" richColors />
        <div className="flex flex-col min-h-screen overflow-x-hidden w-full">
          <Header session={session} categories={categories} /> {/* categories eklendi */}
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