// ✅ Bu satır en üste
export const dynamic = "force-dynamic";

import LoginForm from "@/components/(frontend)/auth/login-form";

const LoginPage = async () => {


  return (
    <div className="flex justify-center mt-10">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
