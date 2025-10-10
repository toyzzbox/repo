"use client";

import Logo from '@/components/(frontend)/header/Logo';
import { useRouter } from 'next/navigation';
import { CiShoppingCart } from 'react-icons/ci';

const Header = () => {
  const router = useRouter();
  
  return (
    <div className="bg-orange-400">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Başlık */}
          <div className="flex-1 text-center">
            <h1 className="font-bold text-white text-2xl md:text-3xl">
              🔒 Güvenli Ödeme
            </h1>
          </div>

          {/* Sepet */}
          <div className="flex-shrink-0">
            <div
              className="cursor-pointer flex items-center gap-2 text-white hover:text-gray-100 transition-colors"
              onClick={() => router.push("/cart")}
            >
              <div className="relative">
                <CiShoppingCart className="text-3xl" />
              </div>
              <span className="text-lg md:text-xl font-semibold hidden sm:inline">
                Sepetim
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;