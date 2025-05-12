import React from 'react'
import TopBar from './TopBar'
import Logo from './Logo'
import SearchBar from './Search'
import { auth, signIn } from "@/auth";
import { MenuBar } from './MenuBar'
import Wishlist from './Wishlist'
import CartCount from './CartCount'
import { Button } from '../ui/button'
import UserButton from './UserButton'
import SignInButton from './SignInButton';
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

