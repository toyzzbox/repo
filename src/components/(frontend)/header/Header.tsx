import React from 'react'
import Logo from './Logo'
import TopBar from './TopBar'
import Search from './Search'
import Menu from './Menu'
import Favorites from './Favorites'
import CartCount from './CartCount'
import UserMenu from './UserMenu'

const Header = () => {
  return (
    <div>
       <TopBar/>
       <div className='flex justify-around items-center gap-3'>
       <Logo/>
       <Search/>
        <div className='flex justify-center gap-2'>
          <Favorites/>
          <CartCount/>
          <UserMenu/>
        </div>
       </div>
       <div className='flex items-center justify-center border-b-1 border-gray-150'>
        <Menu />
        </div>
    </div>
  )
}

export default Header