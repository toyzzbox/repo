import Link from 'next/link'
import React from 'react'

const TopBar = () => {
  return (
    <div className='flex justify-end gap-2 m-2'>
        <Link href="/siparislerim">Siparişlerim</Link>
        <Link href="/hakkimizda">Hakkımızda</Link>
        <Link href="/iletisim">İletişim</Link>
        <Link href="/yardim">Yardım</Link>

    </div>
  )
}

export default TopBar