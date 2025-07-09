import { getAllCategoriesFlat } from "@/actions/getHamburgerCategories";
import CategoryTree from "./CategoryTree";

export default async function CategoryTreeWrapper() {
  const categories = await getAllCategoriesFlat();

  return <CategoryTree categories={categories} />;
}
