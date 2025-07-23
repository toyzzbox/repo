// ✅ Bu satır en üste
export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import LoginForm from "@/components/(frontend)/auth/login-form";
import { redirect } from "next/navigation";

const LoginPage = async () => {
  const session = await auth(); // ✅ Server-side oturumu getir

  if (session?.user) {
    redirect("/hesabim"); // ✅ Zaten giriş yaptıysa yönlendir
  }

  return (
    <div className="flex justify-center mt-10">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
