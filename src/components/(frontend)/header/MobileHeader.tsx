'use client';
import { useState, useEffect } from 'react';
import Logo from './Logo';
import HamburgerMenu from './HamburgerMenu';
import CartCountMobile from './CartCountMobile';
import UserMobileMenu from './UserMobileMenu';
import LiveSearch from '../search/LiveSearch';

export default function MobileHeader() {
  const [isSearchVisible, setIsSearchVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  /* ⬇︎ Yukarı-aşağı scroll dinleyicisi */
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;

      if (y > lastScrollY && y > 100) setIsSearchVisible(false);   // aşağı
      else if (y < lastScrollY)        setIsSearchVisible(true);    // yukarı
      if (y === 0)                     setIsSearchVisible(true);    // en üst

      setLastScrollY(y);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <>
      {/* === Sabit header + arama alanı === */}
      <header className="md:hidden fixed inset-x-0 top-0 z-50 bg-white shadow-md">
        {/* üst bar */}
        <div className="flex items-center justify-between h-14 px-4">
          <HamburgerMenu />
          <Logo />
          <div className="flex items-center gap-4 m-2">
            <UserMobileMenu />
            <CartCountMobile />
          </div>
        </div>

        {/* arama: header’ın hemen altında */}
        <div
          className={`transition-transform duration-300 ease-in-out overflow-hidden
            ${isSearchVisible ? 'translate-y-0' : '-translate-y-full'}`}
        >
          <LiveSearch />
        </div>
      </header>

      {/* Sayfa içeriği: header yüksekliği kadar padding bırak */}
      <div className={isSearchVisible ? 'pt-[112px]' : 'pt-14'}>
        {/* ...page content... */}
      </div>
    </>
  );
}
