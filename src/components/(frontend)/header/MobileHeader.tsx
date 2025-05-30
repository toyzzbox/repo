import React from 'react'

import Logo from './Logo'
import SearchBar from './Search'


import HamburgerMenu from './HamburgerMenu';
import CartCountMobile from './CartCountMobile';
import UserMobileMenu from './UserMobileMenu';

export default async function MobileHeader () {



  return (
    <div className='md:hidden'>
       
       <div className="flex justify-between items-center">
  <HamburgerMenu />
  <Logo />
  <div className='flex items-center'>
    <UserMobileMenu/>
  <CartCountMobile/>
  </div>

</div>

        <div className='flex items-center justify-center'>
        <SearchBar />
        </div>
    </div>
  )
}

