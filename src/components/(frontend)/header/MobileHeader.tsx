'use client';
import { useState, useEffect, useRef } from 'react';
import Logo from './Logo';
import HamburgerMenu from './HamburgerMenu';
import CartCountMobile from './CartCountMobile';
import UserMobileMenu from './UserMobileMenu';
import LiveSearch from '../search/LiveSearch';

export default function MobileHeader() {
  const [isSearchVisible, setIsSearchVisible] = useState(true);
  const lastScrollY = useRef(0); // ✅ useRef → güncel scrollY'yi izlemek için

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Aşağı iniyorsak ve 100px'den fazlaysa → gizle
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsSearchVisible(false);
      }
      // Yukarı çıkıyorsak → göster
      else if (currentScrollY < lastScrollY.current) {
        setIsSearchVisible(true);
      }

      // Sayfa en üstteyse → her zaman göster
      if (currentScrollY === 0) {
        setIsSearchVisible(true);
      }

      // Scroll pozisyonunu güncelle
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // 🔒 Sadece bir kez mount edildiğinde çalışır

  return (
    <div className="md:hidden">
      {/* Header: Daima görünür */}
      <div className="fixed top-0 left-0 right-0 bg-white z-50 shadow-md">
        <div className="flex justify-between items-center px-4 h-16">
          <HamburgerMenu />
          <Logo />
          <div className="flex items-center gap-4">
            <UserMobileMenu />
            <CartCountMobile />
          </div>
        </div>
      </div>

      {/* LiveSearch: Scroll ile kontrol edilir */}
      <div
        className={`
          fixed top-16 left-0 right-0 z-40 bg-white px-4 py-2 shadow-sm
          transition-transform duration-300 ease-in-out
          ${isSearchVisible ? 'translate-y-0' : '-translate-y-full'}
        `}
      >
        <LiveSearch />
      </div>

      {/* Sayfa içeriği */}
      <div className={`transition-all duration-300 ${isSearchVisible ? 'pt-32' : 'pt-16'}`}>
        {/* Diğer içerikler burada */}
      </div>
    </div>
  );
}
