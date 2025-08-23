import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import LoginForm from "@/components/(frontend)/auth/login-form";

export default async function LoginPage() {
  try {
    // Cookie objesini await ile al
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("sessionToken")?.value;
    
    if (sessionToken) {
      // Session'ı sessionToken ile ara (token değil)
      const session = await prisma.session.findUnique({
        where: { 
          sessionToken: sessionToken // 'token' yerine 'sessionToken'
        },
        include: {
          user: true // İsteğe bağlı: user bilgilerini de al
        }
      });
      
      if (session && session.expiresAt > new Date()) {
        // Ana sayfaya yönlendir (dashboard yerine)
        redirect("/"); // veya redirect("/dashboard") dashboard'a göndermek için
      }
      
      // Eğer session süresi dolmuşsa, session'ı sil
      if (session && session.expiresAt <= new Date()) {
        await prisma.session.delete({
          where: { sessionToken }
        });
        
        // Cookie'yi de temizle
        const cookieStore = await cookies();
        cookieStore.delete("sessionToken");
      }
    }
  } catch (error) {
    console.error("Session kontrolü hatası:", error);
    // Hata durumunda login sayfasını göster
  }

  return (
    <div className="flex justify-center mt-10">
      <LoginForm />
    </div>
  );
}