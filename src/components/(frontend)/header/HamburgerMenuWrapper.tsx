// components/(frontend)/header/HamburgerMenuWrapper.tsx
import HamburgerMenu from "./HamburgerMenu";

interface HamburgerMenuWrapperProps {
  categories: any; // Kategori tipinizi kullanın
}

export default function HamburgerMenuWrapper({ categories }: HamburgerMenuWrapperProps) {
  return <HamburgerMenu categories={categories} />;
}