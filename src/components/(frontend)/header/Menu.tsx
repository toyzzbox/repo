import Link from 'next/link'
import React from 'react'

const Menu = () => {
  return (
    <div className='font-bold flex gap-3 hidden sm:block'>
         <Link href="/hakkimizda">Oyuncaklar</Link>
        <Link href="/hakkimizda">Anne & Bebek</Link>
        <Link href="/hakkimizda">Spor & Outdoor</Link>
        <Link href="/hakkimizda">Okul & Kırtasiye</Link>
        <Link href="/hakkimizda">Hediyelik</Link>
        <Link href="/hakkimizda">Elektronik</Link>
       
        <Link href="/hakkimizda">Markalar</Link>
        <Link href="/hakkimizda">Fırsatlar</Link>

    </div>
  )
}

export default Menu