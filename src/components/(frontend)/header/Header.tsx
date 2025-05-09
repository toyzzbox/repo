import React from 'react'
import Logo from './Logo'
import TopBar from './TopBar'
import Search from './Search'
import Menu from './Menu'

const Header = () => {
  return (
    <div>
       <TopBar/>
       <div>
       <Logo/>
       <Search/>

       </div>
       <Menu/>
      
    </div>
  )
}

export default Header