import { auth } from "@/auth";
import RegisterForm from "@/components/(frontend)/auth/register-form";
import { redirect } from "next/navigation";

const RegisterPage = async () => {
  const session = await auth();

  // ✅ Doğru yaklaşım: session varsa değil, session.user varsa yönlendirme
  if (session?.user) {
    redirect("/dashboard");
  }

  // User is not authenticated, show login form
  return (
    <div className='flex justify-center mt-10'>
      <RegisterForm/>
    </div>
  );
};

export default RegisterPage;