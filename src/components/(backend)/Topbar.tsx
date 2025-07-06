import React from 'react'
import Sidebar from './Sidebar'

const Topbar = () => {
  return (
    <div className='flex justify-between items-center bg-gray-600 p-2 fixed inset-0 bg-opacity-50 z-40 "
    '>

        <div className='text-2xl p-2 text-white'>Toyzz Box</div>
        <div className='text-lg text-white'>
            Çıkış Yap
        </div>
    </div>
  )
}

export default Topbar