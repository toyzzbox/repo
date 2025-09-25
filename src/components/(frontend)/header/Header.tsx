// components/(frontend)/header/Header.tsx
"use client";
import React from 'react'
import Logo from './Logo'
import TopBar from './TopBar'
import FavoritesClient from './FavoritesClient'
import CartCount from './CartCount'
import UserMenuClient from './UserMenuClient'
import MobileHeader from './MobileHeader'
import LiveSearch from '../search/LiveSearch'
import MegaMenu from './MegaMenu'

interface HeaderProps {
  session: any;
  categories: any; // BURAYI EKLEYİN
}

const Header = ({ session, categories }: HeaderProps) => { // categories eklendi
  return (
    <>
      <div className="w-[1200px] mx-auto px-[50px]">
        <div className='hidden sm:block'>
          <TopBar/>
          <div className='flex justify-between items-center gap-3'>
            <Logo />
            <LiveSearch />
            <div className='hidden sm:flex items-center gap-2 p-2'>
              <UserMenuClient session={session} />
              <FavoritesClient session={session} />
              <CartCount />
            </div>
          </div>
        </div>
        <div className='flex items-center justify-center border-b-1 border-gray-150'>
          <MegaMenu/>
        </div>
      </div>
      <MobileHeader session={session} categories={categories} />
    </>
  )
}

export default Header