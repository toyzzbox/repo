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
       <div className='flex justify-between'>
       <Logo/>
       <Search/>
        <div>
          <Favorites/>
          <CartCount/>
          <UserMenu/>
        </div>
       </div>
       <Menu/>
      
    </div>
  )
}

export default Header