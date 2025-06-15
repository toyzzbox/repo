"use client"

import React, { useState, useEffect, useRef } from "react";

import  HamburgerMenu  from "./HamburgerMenu";
import  Logo  from "./Logo";
import  UserMobileMenu  from "./UserMobileMenu";
import  CartCountMobile  from "./CartCountMobile";
import LiveSearch from "../search/LiveSearch";

const MobileHeader = () => {
  const [visible, setVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Header gizleme/gösterme mantığı
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        // Aşağı kaydırılıyor ve belli bir mesafeden sonra gizle
        setVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        // Yukarı kaydırılıyor, göster
        setVisible(true);
      }

      // Scroll shadow efekti için
      setIsScrolled(currentScrollY > 10);
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* Main Header */}
      <header
        className={`
          fixed top-0 left-0 right-0 z-50
          bg-white/95 backdrop-blur-sm
          transition-all duration-300 ease-in-out
          ${visible ? "translate-y-0" : "-translate-y-full"}
          ${isScrolled ? "shadow-md" : "shadow-sm"}
        `}
      >
        <div className="flex items-center justify-between px-4 h-14 sm:h-16">
          {/* Left Section */}
          <div className="flex items-center">
            <HamburgerMenu />
          </div>

          {/* Center Section */}
          <div className="flex-1 flex justify-center">
            <Logo />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            <UserMobileMenu />
            <CartCountMobile />
          </div>
        </div>
      </header>

      {/* Live Search */}
      <div
        className={`
          fixed top-14 sm:top-16 left-0 right-0 z-40
          transition-all duration-300 ease-in-out
          ${visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
        `}
      >
        <LiveSearch />
      </div>

      {/* Spacer - Header'ın altındaki içeriği itmek için */}
      <div className="h-14 sm:h-16" />
      {/* Live Search için ekstra boşluk gerekirse */}
      <div className="h-12 sm:h-14" />
    </>
  );
};

export default MobileHeader;