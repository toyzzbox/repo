import React from 'react'

import Logo from './Logo'
import SearchBar from './Search'

import CartCount from './CartCount'

import HamburgerMenu from './HamburgerMenu';

export default async function MobileHeader () {



  return (
    <div className='md:hidden'>
       
       <div className="flex justify-between">
  <HamburgerMenu />
  <Logo />
  <CartCount />
</div>

        <div className='flex items-center justify-center'>
        <SearchBar />
        </div>
    </div>
  )
}

