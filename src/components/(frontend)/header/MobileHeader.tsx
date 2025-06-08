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

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Scroll yönünü belirle
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Aşağı scroll - LiveSearch'i gizle
        setIsSearchVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Yukarı scroll - LiveSearch'i göster
        setIsSearchVisible(true);
      }
      
      // Sayfanın en üstündeyse her zaman göster
      if (currentScrollY === 0) {
        setIsSearchVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    // Scroll event listener ekle
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Cleanup function
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
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
      
      {/* LiveSearch alanı - scroll ile gizlenir/görünür */}
      <div 
        className={`
          fixed top-30 left-0 right-0 z-40 bg-white px-4 py-2 shadow-sm
          transition-transform duration-300 ease-in-out
          ${isSearchVisible ? 'transform translate-y-0' : 'transform -translate-y-full'}
        `}
      >
        <LiveSearch />
      </div>
      
      {/* İçerik için boşluk - LiveSearch görünür olduğunda */}
      <div className={`transition-all duration-300 ${isSearchVisible ? 'pt-32' : 'pt-16'}`}>
        {/* Sayfa içeriğiniz buraya gelecek */}
      </div>
    </div>
  );
}