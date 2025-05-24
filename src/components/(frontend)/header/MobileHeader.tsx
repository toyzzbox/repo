import React from 'react'

import Logo from './Logo'
import SearchBar from './Search'


import HamburgerMenu from './HamburgerMenu';
import CartCountMobile from './CartCountMobile';

export default async function MobileHeader () {



  return (
    <div className='md:hidden'>
       
       <div className="flex justify-between">
  <HamburgerMenu />
  <Logo />
  <CartCountMobile/>
</div>

        <div className='flex items-center justify-center'>
        <SearchBar />
        </div>
    </div>
  )
}

