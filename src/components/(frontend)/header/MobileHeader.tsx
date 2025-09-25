// components/(frontend)/header/MobileHeader.tsx
import CartCountMobile from './CartCountMobile';
import UserMobileMenuClient from './UserMobileMenuClient'; // İsim değişti
import LiveSearch from '../search/LiveSearch';
import MobileLogo from './MobileLogo';
import HamburgerMenuWrapper from './HamburgerMenuWrapper';

interface MobileHeaderProps {
  session: any;
}

export default function MobileHeader({ session }: MobileHeaderProps) {
  return (
    <div className="md:hidden">
      {/* Header: her zaman görünür */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white h-16">
        <div className="flex justify-between items-center h-full px-4">
          <HamburgerMenuWrapper />
          <MobileLogo />
          <div className="flex items-center gap-4">
            <UserMobileMenuClient session={session} />
            <CartCountMobile />
          </div>
        </div>
      </div>
      {/* LiveSearch: Header'ın hemen altında */}
      <div className="fixed left-0 right-0 z-40 bg-white px-4 py-2 shadow-sm top-16">
        <LiveSearch />
      </div>
      {/* İçerik padding */}
      <div className="pt-20">
        {/* Sayfa içeriği */}
      </div>
    </div>
  );
}