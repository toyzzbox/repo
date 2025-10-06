// components/(frontend)/header/Header.tsx
import React from 'react'
import Logo from './Logo'
import TopBar from './TopBar'
import FavoritesClient from './FavoritesClient'
import CartCount from './CartCount'
import UserMenuClient from './UserMenuClient'
import MobileHeader from './MobileHeader'
import LiveSearch from '../search/LiveSearch'
import MegaMenu from './MegaMenu'
import { getCart } from '@/actions/cart'
import { getCategories } from '@/actions/categoryMenu'

interface HeaderProps {
  session: any;
  categories: any;
}

const Header = async ({ session, categories }: HeaderProps) => {
  // Sepet verisini al
  let cartData;
  try {
    cartData = await getCart();
  } catch (error) {
    console.error('Cart data fetch error:', error);
    // Hata durumunda boş sepet döndür
    cartData = {
      items: [],
      summary: {
        subtotal: 0,
        shippingCost: 0,
        total: 0,
        itemCount: 0,
        freeShippingThreshold: 500,
        remainingForFreeShipping: 500,
      },
    };
  }

  let menuCategories = categories;
  if (!menuCategories) {
    try {
      menuCategories = await getCategories();
    } catch (error) {
      console.error('Categories fetch error:', error);
      menuCategories = [];
    }
  }
  return (
    <>
      <div className="w-[1200px] mx-auto px-[50px]">
        <div className="hidden sm:block">
          <TopBar />
          <div className="flex justify-between items-center gap-3">
            <Logo />
            <LiveSearch />
            <div className="hidden sm:flex items-center gap-2 p-2">
              <UserMenuClient session={session} />
              <FavoritesClient session={session} />
              <CartCount initialCart={cartData} />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center border-b-1 border-gray-150">
        <MegaMenu initialCategories={menuCategories} />
        </div>
      </div>
      <MobileHeader session={session} categories={categories} />
    </>
  )
}

export default Header