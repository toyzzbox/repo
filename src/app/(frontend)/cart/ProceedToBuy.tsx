'use client'; // Bileşenin istemci bileşeni olduğunu belirtmek için

import React from 'react';
import { useAppSelector } from "@/hooks/redux"; // Redux hook'unu içe aktar
import { getCart } from "@/redux/cartSlice"; // Sepet verilerini almak için seçici
import { useRouter } from 'next/navigation';

const ProceedToBuy = () => {
  const cart = useAppSelector(getCart); // Sepet öğelerini Redux store'dan alıyoruz

  // Toplam fiyatı hesapla
  const totalProductPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  
  // Kargo ücreti (örneğin sabit bir değer veya başka bir hesaplama)
  const shippingCost = 10; // Örnek kargo ücreti
  const grandTotal = totalProductPrice + shippingCost; // Toplam fiyatı hesapla


  const router = useRouter();

  const handleClick = () => {
    router.push("/checkout"); // Route to the home page
  };

  return (
    <div className='w-[30%]'>
   
      <div className='rounded-lg border border-gray-200 p-4 mt-4'>
        <div className='flex justify-between'>
          <span>Ürünün Toplamı:</span>
          <span>{` ${totalProductPrice.toFixed(2)} TL`}</span>
        </div>
        <div className='flex justify-between'>
          <span>Kargo Toplam:</span>
          <span>{` ${shippingCost.toFixed(2)} TL`}</span>
        </div>
        <hr className="my-2" />
        <div className='flex justify-between font-bold'>
          <span>Toplam:</span>
          <span>{` ${grandTotal.toFixed(2)} TL`}</span>
        </div>
        <button  onClick={handleClick} className='bg-orange-500 text-white py-2 px-4 rounded w-full p-2 mr-3 mt-3'>Siparişi Onayla</button>
      </div>
    </div>
  );
}

export default ProceedToBuy;
