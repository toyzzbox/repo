'use client';

import React, { useEffect, useState } from 'react';

import Logo from './Logo';
import SearchBar from './Search';
import HamburgerMenu from './HamburgerMenu';
import CartCountMobile from './CartCountMobile';
import UserMobileMenu from './UserMobileMenu';

export default function MobileHeader() {
  const [showSearchBar, setShowSearchBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY) {
        // Yukarı kaydırıyor
        setShowSearchBar(true);
      } else {
        // Aşağı kaydırıyor
        setShowSearchBar(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div className="md:hidden">
      {/* Sabit header */}
      <div className="fixed top-0 left-0 right-0 bg-white z-50 shadow-md">
        <div className="flex justify-between items-center px-4">
          <HamburgerMenu />
          <Logo />
          <div className="flex items-center gap-4 m-2">
            <UserMobileMenu />
            <CartCountMobile />
          </div>
        </div>
      </div>

      {/* Arama çubuğu (scroll yönüne göre görünür/gizli) */}
      <div
        className={`transition-all duration-300 px-4 ${
          showSearchBar ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
        }`}
      >
        <div className="pt-24 flex items-center justify-center">
          <SearchBar />
        </div>
      </div>
    </div>
  );
}
