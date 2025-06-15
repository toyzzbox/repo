'use client';
import { useState, useEffect, useRef } from 'react';
import HamburgerMenu from './HamburgerMenu';
import CartCountMobile from './CartCountMobile';
import UserMobileMenu from './UserMobileMenu';
import LiveSearch from '../search/LiveSearch';
import MobileLogo from './MobileLogo';

export default function MobileHeader() {
  const [isSearchVisible, setIsSearchVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;

      // ↓ Aşağı kayınca (100 px’ten sonra) gizle
      if (y > lastScrollY.current && y > 100) setIsSearchVisible(false);
      // ↑ Yukarı kayınca göster
      else if (y < lastScrollY.current) setIsSearchVisible(true);
      // En üstte mutlaka göster
      if (y === 0) setIsSearchVisible(true);

      lastScrollY.current = y;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="md:hidden">
      {/* ───── Header: her zaman görünür ───── */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white h-16">
        <div className="flex justify-between items-center h-full px-4">
          <HamburgerMenu />
          <MobileLogo/>
          <div className="flex items-center gap-4">
            <UserMobileMenu />
            <CartCountMobile />
          </div>
        </div>
      </div>

      {/* ───── LiveSearch: Header’ın hemen altında ───── */}
      <div
        className={`
          fixed left-0 right-0 z-40 bg-white px-4 py-2 shadow-sm
          transition-transform duration-300 ease-in-out
          ${isSearchVisible ? 'translate-y-0' : '-translate-y-full'}
          top-16        /* header yüksekliği (64 px) kadar aşağıda */
        `}
      >
        <LiveSearch />
      </div>

      {/* İçerik • padding: header + LiveSearch (64 px + 48 px ≈ 112 px) */}
      <div className={`transition-all duration-300 ${isSearchVisible ? 'pt-32' : 'pt-16'}`}>
        {/* Sayfanın geri kalanı */}
      </div>
    </div>
  );
}
