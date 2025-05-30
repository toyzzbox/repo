import React from 'react'

import Logo from './Logo'
import SearchBar from './Search'


import HamburgerMenu from './HamburgerMenu';
import CartCountMobile from './CartCountMobile';
import UserMobileMenu from './UserMobileMenu';

export default async function MobileHeader() {
  return (
    <div className="md:hidden">
      {/* Sabit üst header */}
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

      {/* Arama çubuğu (sabit değil) */}
      <div className="flex items-center justify-center mt-22 px-4">
        <SearchBar />
      </div>
    </div>
  );
}
