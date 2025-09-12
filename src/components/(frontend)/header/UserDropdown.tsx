"use client"
import { useState } from 'react';
import { ChevronDown, User, Package, Heart, MapPin, CreditCard, Gift, Headphones, LogOut, Star, ShoppingBag, LogIn, UserPlus } from 'lucide-react';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Simüle edilmiş session durumu - gerçek uygulamanızda getSession() kullanacaksınız
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Bu kısmı test için ekledim
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuClick = (action) => {
    console.log(`${action} seçildi`);
    setIsOpen(false);
  };

  const handleLogin = () => {
    console.log('Giriş yapılıyor...');
    // Gerçek uygulamanızda login sayfasına yönlendirme yapacaksınız
    setIsLoggedIn(true); // Test için
    setIsOpen(false);
  };

  const handleRegister = () => {
    console.log('Üye olunuyor...');
    // Gerçek uygulamanızda register sayfasına yönlendirme yapacaksınız
    setIsOpen(false);
  };

  const handleLogout = async () => {
    console.log('Çıkış yapılıyor...');
    // Gerçek uygulamanızda logout() fonksiyonunu çağıracaksınız
    setIsLoggedIn(false); // Test için
    setIsOpen(false);
  };

  // Test için login/logout geçiş butonu
  const toggleLoginStatus = () => {
    setIsLoggedIn(!isLoggedIn);
    setIsOpen(false);
  };

  return (
    <div className="flex justify-between items-start pt-8 px-8 min-h-screen bg-gray-50">
      {/* Test Butonu - Gerçek uygulamada kaldırılacak */}
      <button 
        onClick={toggleLoginStatus}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm"
      >
        Test: {isLoggedIn ? 'Logout' : 'Login'} Durumu
      </button>

      <div className="relative">
        {/* Dropdown Trigger Button */}
        <button
          onClick={toggleDropdown}
          className="flex items-center space-x-2 bg-white px-3 py-2 rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          {isLoggedIn ? (
            <span className="text-sm font-medium text-gray-700 hidden md:block">Merhaba, Ayşe</span>
          ) : (
            <span className="text-sm font-medium text-gray-700 hidden md:block">Hesabım</span>
          )}
          <ChevronDown 
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 py-3 z-50">
            
            {/* Giriş Yapmış Kullanıcı İçin Menü */}
            {isLoggedIn ? (
              <>
                {/* User Info Section */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900">Ayşe Demir</div>
                      <div className="text-xs text-gray-500">ayse.demir@email.com</div>
                      <div className="flex items-center mt-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600 ml-1">Premium Üye</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                  <div className="flex justify-between text-center">
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900">{user?.orderCount || 12}</div>
                      <div className="text-xs text-gray-500">Sipariş</div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-emerald-600">₺{user?.points || 850}</div>
                      <div className="text-xs text-gray-500">Puan</div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-purple-600">{user?.favoriteCount || 7}</div>
                      <div className="text-xs text-gray-500">Favori</div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button
                    onClick={() => handleMenuClick('Siparişlerim')}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors duration-150"
                  >
                    <Package className="w-4 h-4 mr-3" />
                    <span className="flex-1 text-left">Siparişlerim</span>
                    <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full">2 Aktif</span>
                  </button>

                  <button
                    onClick={() => handleMenuClick('Favorilerim')}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
                  >
                    <Heart className="w-4 h-4 mr-3" />
                    <span className="flex-1 text-left">Favorilerim</span>
                    <span className="text-xs text-gray-400">7 ürün</span>
                  </button>

                  <button
                    onClick={() => handleMenuClick('Sepetim')}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150"
                  >
                    <ShoppingBag className="w-4 h-4 mr-3" />
                    <span className="flex-1 text-left">Sepetim</span>
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">3</span>
                  </button>

                  <button
                    onClick={() => handleMenuClick('Adreslerim')}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                    Adreslerim
                  </button>

                  <button
                    onClick={() => handleMenuClick('Ödeme Yöntemlerim')}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <CreditCard className="w-4 h-4 mr-3 text-gray-400" />
                    Ödeme Yöntemlerim
                  </button>

                  <button
                    onClick={() => handleMenuClick('Hediye Kartlarım')}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <Gift className="w-4 h-4 mr-3 text-gray-400" />
                    Hediye Kartlarım
                  </button>

                  <button
                    onClick={() => handleMenuClick('Hesabım')}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <User className="w-4 h-4 mr-3 text-gray-400" />
                    Hesap Ayarlarım
                  </button>

                  <button
                    onClick={() => handleMenuClick('Müşteri Hizmetleri')}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <Headphones className="w-4 h-4 mr-3 text-gray-400" />
                    Müşteri Hizmetleri
                  </button>
                </div>

                {/* Separator */}
                <div className="border-t border-gray-100 my-2"></div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Güvenli Çıkış
                </button>
              </>
            ) : (
              /* Giriş Yapmamış Kullanıcı İçin Menü */
              <>
                {/* Welcome Section */}
                <div className="px-4 py-4 border-b border-gray-100 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Hoş Geldiniz!</h3>
                  <p className="text-sm text-gray-500">Hesabınıza giriş yaparak tüm özelliklerden yararlanın</p>
                </div>

                {/* Login/Register Buttons */}
                <div className="px-4 py-4 space-y-3">
                  <button
                    onClick={handleLogin}
                    className="flex items-center justify-center w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors duration-150"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Giriş Yap
                  </button>
                  
                  <button
                    onClick={handleRegister}
                    className="flex items-center justify-center w-full px-4 py-3 border border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-medium rounded-lg transition-colors duration-150"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Üye Ol
                  </button>
                </div>

                {/* Guest Features */}
                <div className="border-t border-gray-100 py-2">
                  <div className="px-4 py-2">
                    <p className="text-xs text-gray-500 mb-2 font-medium">Misafir olarak:</p>
                  </div>
                  
                  <button
                    onClick={() => handleMenuClick('Misafir Sepeti')}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150"
                  >
                    <ShoppingBag className="w-4 h-4 mr-3" />
                    <span className="flex-1 text-left">Sepetim</span>
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">2</span>
                  </button>

                  <button
                    onClick={() => handleMenuClick('Sipariş Takibi')}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <Package className="w-4 h-4 mr-3 text-gray-400" />
                    Sipariş Takip Et
                  </button>

                  <button
                    onClick={() => handleMenuClick('Müşteri Hizmetleri')}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <Headphones className="w-4 h-4 mr-3 text-gray-400" />
                    Yardım
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Overlay to close dropdown when clicking outside */}
        {isOpen && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          ></div>
        )}
      </div>
    </div>
  );
}