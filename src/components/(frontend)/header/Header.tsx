"use client"
import React from 'react';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Components
import Logo from './Logo';
import TopBar from './TopBar';
import LiveSearch from '../search/LiveSearch';
import MegaMenu from './MegaMenu';

// Lazy load edilecek components (performans için)
const Favorites = dynamic(() => import('./Favorites'), {
  loading: () => <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />,
  ssr: false // Client-side only
});

const CartCount = dynamic(() => import('./CartCount'), {
  loading: () => <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />,
  ssr: false
});

const UserMenu = dynamic(() => import('./UserMenu'), {
  loading: () => <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />,
  ssr: false
});

const MobileHeader = dynamic(() => import('./MobileHeader'), {
  loading: () => null,
  ssr: false
});
const isValidSession = (session: any): session is UserSession => {
  return session && session.user && typeof session.user === 'object';
};

// Header.tsx
interface Session {
  user?: {  // user optional idi
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

interface HeaderProps {
  className?: string;
  isSticky?: boolean;
  session?: Session | null;
}

interface UserSession {
  user: {     // user artık required
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}
const Header: React.FC<HeaderProps> = ({ 
  className = '', 
  isSticky = true,
  session 
}) => {
  return (
    <>
      {/* Main Header - Desktop & Tablet */}
      <header
        className={`bg-white shadow-sm ${isSticky ? 'sticky top-0 z-40' : ''} ${className}`}
        role="banner"
        itemScope
        itemType="https://schema.org/WPHeader"
      >
        {/* Container with max-width constraint */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-12 lg:px-[50px]">
          
          {/* Top Bar - Hidden on mobile */}
          <div className="hidden sm:block">
            <Suspense fallback={<div className="h-8 bg-gray-50" />}>
              <TopBar />
            </Suspense>
          </div>

          {/* Main Navigation Bar */}
          <div className="flex justify-between items-center gap-3 py-4">
            
            {/* Logo Section */}
            <div className="flex-shrink-0">
              <Logo />
            </div>

            {/* Search Section - Hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <Suspense fallback={
                <div className="w-full h-10 bg-gray-100 rounded-lg animate-pulse" />
              }>
                <LiveSearch />
              </Suspense>
            </div>

            {/* Action Items - Hidden on mobile */}
            <div className="hidden sm:flex items-center gap-2 p-2">
              <nav 
                className="flex items-center gap-2"
                role="navigation"
                aria-label="Kullanıcı işlemleri"
              >
        
                <Suspense fallback={<div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />}>
                  <Favorites />
                </Suspense>
                
                <Suspense fallback={<div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />}>
                  <CartCount />
                </Suspense>
              </nav>
            </div>
          </div>

          {/* Mobile Search - Only visible on mobile */}
          <div className="block md:hidden pb-4">
            <Suspense fallback={
              <div className="w-full h-10 bg-gray-100 rounded-lg animate-pulse" />
            }>
              <LiveSearch />
            </Suspense>
          </div>
        </div>

        {/* Mega Menu Section */}
        <div className="border-t border-gray-100">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-center justify-center">
              <Suspense fallback={
                <div className="h-12 w-full bg-gray-50 animate-pulse" />
              }>
                <MegaMenu />
              </Suspense>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header - Separate component for mobile-specific features */}
      <div className="sm:hidden">
        <Suspense fallback={null}>
          <MobileHeader />
        </Suspense>
      </div>
    </>
  );
};

export default Header;