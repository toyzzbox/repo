// components/(frontend)/header/Header.tsx
"use client";

import React from 'react'
import Logo from './Logo'
import TopBar from './TopBar'
import Favorites from './Favorites'
import CartCount from './CartCount'
import UserMenu from './UserMenu'
import MobileHeader from './MobileHeader'
import LiveSearch from '../search/LiveSearch'
import MegaMenu from './MegaMenu'

const Header = () => {
  return (
    <>
      <div className="w-[1200px] mx-auto px-[50px]"> {/* yaklaşık 20cm padding */}
        <div className='hidden sm:block'>
          <TopBar/>
          <div className='flex justify-between items-center gap-3'>
            <Logo />
            <LiveSearch />
            <div className='hidden sm:flex items-center gap-2 p-2'>
              <UserMenu />
              <Favorites />
              <CartCount />
            </div>
          </div>
        </div>
        <div className='flex items-center justify-center border-b-1 border-gray-150'>
          <MegaMenu/> 
        </div>
      </div>
      <MobileHeader/>
    </>
  )
}

export default Header