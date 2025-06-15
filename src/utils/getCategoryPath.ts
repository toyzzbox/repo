import { Category } from "@/types/category";

export function getCategoryPath(category: Category): string {
  const slugs: string[] = [];

  let current: Category | undefined = category;

  while (current) {
    slugs.unshift(current.slug); // en başa ekle
    current = current.parent as Category | undefined; // parent'ı varsa yukarı çık
  }

  return slugs.join("/"); // örn: "oyuncaklar/oyuncak-arabalar"
}
