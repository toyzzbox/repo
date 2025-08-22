
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import LoginForm from "@/components/(frontend)/auth/login-form";

export default async function LoginPage() {
 // Cookie objesini await ile al
 const cookieStore = await cookies();
 const token = cookieStore.get("sessionToken")?.value;

 if (token) {
   const session = await prisma.session.findUnique({
     where: { token },
   });

   if (session && session.expiresAt > new Date()) {
     redirect("/dashboard");
   }
 }

  return (
    <div className="flex justify-center mt-10">
      <LoginForm />
    </div>
  );
}
