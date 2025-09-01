import "../globals.css"; // 🌟 BURASI ZORUNLU! 🌟
import Footer from "@/components/(frontend)/footer/Footer";
import Header from "@/components/(frontend)/header/Header";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import PageContainer from "@/components/(frontend)/container/PageContainer";
import { Toaster } from "sonner";
import GtagClient from "@/components/(frontend)/analytics/GtagClient";
import MobileFooter from "@/components/(frontend)/footer/MobileFooter";
import { getSession } from "@/lib/session"; // Session import edildi

export default async function FrontendLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  // Session'ı server component'te al
  const session = await getSession();

  return (
    <>
      <GtagClient />
      <ReduxProvider>
        <Toaster position="top-right" richColors />
        <div className="flex flex-col min-h-screen">
          {/* Session'ı Header'a prop olarak geç */}
          <Header session={session} />
          <main className="flex-1">
            <PageContainer>{children}</PageContainer>
          </main>
          <footer>
            <Footer />
            <MobileFooter />
          </footer>
        </div>
      </ReduxProvider>
    </>
  );
}