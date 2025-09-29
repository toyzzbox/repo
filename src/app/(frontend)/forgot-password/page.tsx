"use client"
import ForgotPasswordForm from './ForgotPasswordForm'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            🔒 Şifremi Unuttum
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            E-posta adresinizi girin, şifre sıfırlama bağlantısı gönderelim
          </p>
        </div>

        {/* Form */}
        <div className="bg-white shadow-xl rounded-lg p-8">
          <ForgotPasswordForm action={} />
          
          {/* Back to login */}
          <div className="mt-6 text-center">
            <Link 
              href="/login" 
              className="text-indigo-600 hover:text-indigo-500 text-sm font-medium transition-colors"
            >
              ← Giriş sayfasına dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}