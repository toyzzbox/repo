import { redirectIfAuthenticated } from "@/lib/session";
import LoginForm from "@/components/(frontend)/auth/login-form";

export default async function LoginPage() {
  // Eğer zaten giriş yapmışsa yönlendir
  await redirectIfAuthenticated();
  
  return (
    <div className="flex justify-center mt-10">
      <LoginForm />
    </div>
  );
}