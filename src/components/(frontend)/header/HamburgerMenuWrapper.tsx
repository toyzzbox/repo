import { getAllCategories } from "@/actions/getHamburgerCategories";
import HamburgerMenu from "./HamburgerMenu";

export default async function HamburgerMenuWrapper() {
  const categories = await getAllCategories();

  return <HamburgerMenu categories={categories} />;
}
