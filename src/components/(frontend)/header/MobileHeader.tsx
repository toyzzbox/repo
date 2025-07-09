import HamburgerMenuWrapper from './HamburgerMenuWrapper';
import CartCountMobile from './CartCountMobile';
import UserMobileMenu from './UserMobileMenu';
import LiveSearch from '../search/LiveSearch';
import MobileLogo from './MobileLogo';

export default async function MobileHeader() {
  return (
    <div className="md:hidden">
      {/* ───── Header: her zaman görünür ───── */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white h-16">
        <div className="flex justify-between items-center h-full px-4">
          <HamburgerMenuWrapper /> {/* 🟢 Server Component */}
          <MobileLogo/>
          <div className="flex items-center gap-4">
            <UserMobileMenu />
            <CartCountMobile />
          </div>
        </div>
      </div>

      {/* ───── LiveSearch: Header’ın hemen altında ───── */}
      <div
        className="
          fixed left-0 right-0 z-40 bg-white px-4 py-2 shadow-sm
          top-16
        "
      >
        <LiveSearch />
      </div>

      {/* İçerik padding */}
      <div className="pt-32">
        {/* Sayfa içeriği */}
      </div>
    </div>
  );
}
