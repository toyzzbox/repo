import Link from 'next/link'
import React from 'react'

const TopBar = () => {
  return (
    <div className='flex justify-end gap-2'>
        <Link href="/hakkimizda">Hakkımızda</Link>
        <Link href="/hakkimizda">İletişim</Link>
        <Link href="/hakkimizda">Yardım</Link>

    </div>
  )
}

export default TopBar