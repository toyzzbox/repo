import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sipariş Özeti | ToyzBox',
  description: 'Güvenli ödeme ve teslimat',
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="bg-gray-50">
        {/* Checkout için özel header */}
        <header className="bg-gray-900 text-white py-4 px-6 shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="/" className="text-2xl font-bold hover:opacity-80 transition">
                TOYZZ BOX
              </a>
              <span className="text-gray-400">|</span>
              <span className="text-lg">Güvenli Ödeme</span>
            </div>
            
            {/* Güvenlik ikonları */}
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span className="text-sm text-gray-300">Güvenli Ödeme</span>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main>{children}</main>

        {/* Checkout için minimal footer */}
        <footer className="bg-white border-t mt-12 py-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap justify-between items-center text-sm text-gray-600">
              <div className="flex gap-6 mb-4 md:mb-0">
                <a href="/yardim" className="hover:text-gray-900 transition">
                  Yardım
                </a>
                <a href="/gizlilik" className="hover:text-gray-900 transition">
                  Gizlilik Politikası
                </a>
                <a href="/kosullar" className="hover:text-gray-900 transition">
                  Kullanım Koşulları
                </a>
              </div>
              <p>© 2025 ToyzBox. Tüm hakları saklıdır.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
