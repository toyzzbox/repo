import LoginForm from "@/components/(frontend)/auth/login-form";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const LoginPage = async () => {
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
};

export default LoginPage;
