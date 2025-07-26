import React from 'react'
import Logo from './Logo'
import TopBar from './TopBar'

import Favorites from './Favorites'
import CartCount from './CartCount'
import UserMenu from './UserMenu'
import MobileHeader from './MobileHeader'
import LiveSearch from '../search/LiveSearch'
import MenuBar from './Menu'
const Header = () => {
  return (
   <> <div className='hidden sm:block '>
   <TopBar/>
  
   <div className="w-full px-[50px]"> {/* yaklaşık 20cm padding */}
  <div className='flex justify-between items-center gap-3 w-[1260px}'>
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
    <MenuBar />
    </div>
</div>
<MobileHeader/>
   
   </>
  )
}

export default Header