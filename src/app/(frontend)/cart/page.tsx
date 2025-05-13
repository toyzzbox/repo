import React from 'react'
import ProceedToBuy from './ProceedToBuy'
import { ShoppingCart } from 'lucide-react'

const Cart = () => {
  return (
    <div className='w-[80%] mx-auto mt-10'>
      <div className='flex w-full justify-between'>
<ShoppingCart/>
<ProceedToBuy/>
      </div>
    </div>
  )
}

export default Cart