'use client';
import { useState, useEffect, useRef } from 'react';
import Logo from './Logo';
import HamburgerMenu from './HamburgerMenu';
import CartCountMobile from './CartCountMobile';
import UserMobileMenu from './UserMobileMenu';
import LiveSearch from '../search/LiveSearch';

export default function MobileHeader() {
  const [isSearchVisible, setIsSearchVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsSearchVisible(false); // Aşağı → gizle
      } else if (currentScrollY < lastScrollY.current) {
        setIsSearchVisible(true); // Yukarı → göster
      }

      if (currentScrollY === 0) {
        setIsSearchVisible(true); // En üstte → göster
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="md:hidden">
      {/* Sabit header (daima görünür) */}
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

      {/* Sadece LiveSearch scroll’a göre gizlenir/görünür */}
      <div
        className={`
          fixed top-16 left-0 right-0 z-40 bg-white px-4 py-2 shadow-sm
          transition-transform duration-300 ease-in-out
          ${isSearchVisible ? 'translate-y-0' : '-translate-y-full'}
        `}
      >
        <LiveSearch />
      </div>

      {/* Sayfa içeriği için padding */}
      <div className={`transition-all duration-300 ${isSearchVisible ? 'pt-32' : 'pt-16'}`}>
        {/* Sayfa içeriği */}
      </div>
    </div>
  );
}
