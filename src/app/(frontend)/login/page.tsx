import { auth } from "@/auth";
import LoginForm from "@/components/(frontend)/auth/login-form";
import { redirect } from "next/navigation";

const LoginPage = async () => {
  const session = await auth();

  // ✅ Doğru yaklaşım: session varsa değil, session.user varsa yönlendirme
  if (session?.user) {
    redirect("/dashboard");
  }

  // Kullanıcı oturum açmamışsa login formu göster
  return (
    <div className="flex justify-center mt-10">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
