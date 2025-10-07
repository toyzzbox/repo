"use client";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from "@/actions/login";
import { useSearchParams } from "next/navigation";

const initialState = {
  success: false,
  message: "",
  redirectTo: undefined as string | undefined,
};

export default function LoginForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginUser, initialState);
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  // Başarılı login sonrası yönlendirme
  useEffect(() => {
    if (state?.success && state?.redirectTo) {
      setTimeout(() => {
        router.push(state.redirectTo!);
      }, 1000);
    }
  }, [state?.success, state?.redirectTo, router]);

  return (
    <div className="min-h-screen flex">
      {/* Sol Taraf - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Password Reset Success Message */}
          {message === 'password-reset-success' && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md shadow-md mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-700">
                    Şifreniz başarıyla güncellendi! Artık yeni şifrenizle giriş yapabilirsiniz.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Logo/Başlık */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-orange-600 mb-2">
              🧸 Toyz Box
            </h1>
            <p className="text-gray-600">Hesabınıza giriş yapın</p>
          </div>

          {/* Login Form */}
          <form className="space-y-6" action={formAction}>
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Adresi
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="ornek@email.com"
                disabled={isPending}
              />
            </div>
            
            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Şifre
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Şifrenizi girin"
                disabled={isPending}
              />
            </div>

            {/* Durum mesajları */}
            {state?.message && (
              <div
                className={`rounded-lg p-4 ${
                  state.success
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    {state.success ? (
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3">
                    <p
                      className={`text-sm font-medium ${
                        state.success ? "text-green-800" : "text-red-800"
                      }`}
                    >
                      {state.message}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                  Beni hatırla
                </label>
              </div>

              <div className="text-sm">
                <Link 
                  href="/forgot-password" 
                  className="font-medium text-orange-600 hover:text-orange-700 transition-colors"
                >
                  Şifremi unuttum
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isPending} border-transpa
                className="group relative w-full flex justify-center py-3 px-4 borderrent text-sm font-semibold rounded-lg text-white bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isPending ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Giriş yapılıyor...
                  </div>
                ) : (
                  "Giriş Yap"
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">veya</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-1 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>

           
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-gray-600">
              Hesabınız yok mu?{" "}
              <Link
                href="/register"
                className="font-medium text-orange-600 hover:text-orange-700 transition-colors"
              >
                Hemen kayıt olun
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Sağ Taraf - Görsel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-400 via-red-400 to-yellow-300 items-center justify-center p-12 relative overflow-hidden">
        {/* Dekoratif Arka Plan Şekilleri */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white bg-opacity-20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-white bg-opacity-20 rounded-full blur-2xl"></div>
        
        {/* Ana İçerik */}
        <div className="relative z-10 text-center text-white">
          <div className="mb-8">
            <div className="text-8xl mb-6 animate-bounce">
              🎨
            </div>
            <div className="flex justify-center gap-6 mb-8">
              <span className="text-6xl animate-pulse">🧸</span>
              <span className="text-6xl animate-pulse" style={{animationDelay: '0.2s'}}>🚗</span>
              <span className="text-6xl animate-pulse" style={{animationDelay: '0.4s'}}>🎮</span>
            </div>
            <div className="flex justify-center gap-6">
              <span className="text-5xl animate-bounce" style={{animationDelay: '0.1s'}}>🎪</span>
              <span className="text-5xl animate-bounce" style={{animationDelay: '0.3s'}}>🎯</span>
              <span className="text-5xl animate-bounce" style={{animationDelay: '0.5s'}}>🎭</span>
            </div>
          </div>
          
          <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">
            Hayal Gücünün Sınırı Yok!
          </h2>
          <p className="text-xl opacity-90 max-w-md mx-auto drop-shadow">
            Çocuklarınız için en özel oyuncakları keşfedin ve mutluluğu kapınıza getirin
          </p>
          
          {/* İstatistikler */}
          <div className="mt-12 flex justify-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold">10K+</div>
              <div className="text-sm opacity-80">Mutlu Aile</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm opacity-80">Oyuncak Çeşidi</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">%100</div>
              <div className="text-sm opacity-80">Güvenli Ürün</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}