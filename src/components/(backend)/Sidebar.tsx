import Link from 'next/link'
import React from 'react'

const Sidebar = () => {
  return (
    <div className='bg-gray-400 min-h-screen p-4'>
        <div className='flex flex-col gap-2'>
        <h1 className='font-bold'>Toyzz Box Oyuncak</h1>
        <Link href="/">Dashboard</Link>
        <Link href="/">Ürünler</Link>
        <Link href="/">Ürün Ekle</Link>
        <Link href="/">Kategoriler</Link>
        <Link href="/">Kategori Ekle</Link>
        <Link href="/">Marka</Link>
        <Link href="/">Marka Ekle</Link>
        <Link href="/">Nitelikler</Link>
        <Link href="/">Nitelik Ekle</Link>
        <Link href="/">Nitelik Grubu</Link>
        <Link href="/">Nitelik Grubu Ekle</Link>
        <Link href="/">Gelen Siparişlerim</Link>
        <Link href="/">Müşteriler</Link>
        <Link href="/">Mesajlar</Link>
        </div>
    </div>
  )
}

export default Sidebar