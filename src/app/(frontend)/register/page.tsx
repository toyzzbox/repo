import { auth } from "@/auth";
import RegisterForm from "@/components/(frontend)/auth/register-form";
import { redirect } from "next/navigation";

const RegisterPage = async () => {
  const session = await auth();
  
  // If session exists (user is already logged in), redirect to dashboard
  if (session) {
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