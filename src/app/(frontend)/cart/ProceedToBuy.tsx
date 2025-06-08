import { useAppSelector } from "@/hooks/redux";
import { getCart } from "@/redux/cartSlice";
import { useRouter } from "next/navigation";

const ProceedToBuy = () => {
  const cart = useAppSelector(getCart);
  const router = useRouter();
  const totalProductPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingCost = 100;
  const grandTotal = totalProductPrice + shippingCost;

  const handleCheckout = () => {
    router.push('/checkout');
  };

  return (
    <div className="w-full">
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
        <button 
          onClick={handleCheckout}
          className='block bg-orange-500 text-white py-2 px-4 rounded w-full text-center mt-3'
        >
          Siparişi Onayla
        </button>
      </div>
    </div>
  );
}

export default ProceedToBuy;