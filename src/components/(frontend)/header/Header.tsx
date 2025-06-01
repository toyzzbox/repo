import React from 'react'
import Logo from './Logo'
import TopBar from './TopBar'

import Favorites from './Favorites'
import CartCount from './CartCount'
import UserMenu from './UserMenu'
import MobileHeader from './MobileHeader'
import { MenuBar } from './Menu'
import LiveSearch from '../search/LiveSearch'
const Header = () => {
  return (
   <> <div className='hidden sm:block '>
   <TopBar/>
  
   <div className='flex justify-around items-center gap-3'>
   <Logo/>
   <LiveSearch/>
   <div className='hidden sm:block'>
   <div className="flex justify-between items-center gap-2 px-6 w-[1260]">
      <Favorites/>
      <CartCount/>
      <UserMenu/>
    </div>
   </div>
  
   </div>
   <div className='flex items-center justify-center border-b-1 border-gray-150'>
    <MenuBar />
    </div>
</div>
<MobileHeader/>
   
   </>
  )
}

export default Header