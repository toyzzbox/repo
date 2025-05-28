import Link from 'next/link'
import React from 'react'
import MobileFooter from './MobileFooter'

const Footer = () => {
  return (
   <>
<div className='hidden sm:block'>
       <div className='flex justify-between max-w-screen-xl mx-auto gap-10 m-2'>
       <div className='flex flex-col'>
            <h2>Kategoriler</h2>
            <Link href="/">Oyuncaklar</Link>
            <Link href="/">Anne & Bebek</Link>
            <Link href="/">Okul & Kırtasiye</Link>
            <Link href="/">Spor & Outdoor</Link>
            <Link href="/">Hediyelik</Link>
        </div>
        <div className='flex flex-col'>
            <h2>Popüler Kategoriler</h2>
            <Link href="/">Oyuncak Araba ve Setleri</Link>
            <Link href="/">Oyuncak Bebek ve Setleri</Link>
            <Link href="/">Bebek Oyuncakları</Link>
            <Link href="/">Oyuncak Araba ve Setleri</Link>
        </div>
        <div className='flex flex-col'>
            <h2>Popüler Kategoriler</h2>
            <Link href="/">Oyuncak Araba ve Setleri</Link>
            <Link href="/">Oyuncak Bebek ve Setleri</Link>
            <Link href="/">Bebek Oyuncakları</Link>
            <Link href="/">Oyuncak Araba ve Setleri</Link>
        </div>
        <div className='flex flex-col'>
            <h2>Popüler Kategoriler</h2>
            <Link href="/">Oyuncak Araba ve Setleri</Link>
            <Link href="/">Oyuncak Bebek ve Setleri</Link>
            <Link href="/">Bebek Oyuncakları</Link>
            <Link href="/">Oyuncak Araba ve Setleri</Link>
        </div>
        <div className='flex flex-col'>
            <h2>Popüler Kategoriler</h2>
            <Link href="/">Oyuncak Araba ve Setleri</Link>
            <Link href="/">Oyuncak Bebek ve Setleri</Link>
            <Link href="/">Bebek Oyuncakları</Link>
            <Link href="/">Oyuncak Araba ve Setleri</Link>
        </div>
    </div>
       </div>
    
    <div>
    <MobileFooter/>
    </div></>
  )
}

export default Footer