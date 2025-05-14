import { auth } from "@/auth";
import LoginForm from "@/components/(frontend)/auth/login-form";

import { redirect } from "next/navigation";

const LoginPage = async () => {
  const session = await auth();
  
  // If session exists (user is already logged in), redirect to dashboard
  if (session) {
    redirect("/dashboard");
  }
  
  // User is not authenticated, show login form
  return (
    <div className='flex justify-center mt-10'>
      <LoginForm/>
    </div>
  );
};

export default LoginPage;