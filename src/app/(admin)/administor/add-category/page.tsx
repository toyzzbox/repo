import { prisma } from "@/lib/prisma";
import CategoryForm from "./CategoryForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Build sırasında DB yoksa patlamasın diye
 * her şeyi try/catch ile koruyoruz
 */
async function getSafeCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    console.error("Category fetch failed:", e);
    return [];
  }
}

async function getSafeMedias() {
  try {
    const medias = await prisma.media.findMany({
      orderBy: { createdAt: "desc" },
    });
    return JSON.parse(JSON.stringify(medias));
  } catch (e) {
    console.error("Media fetch failed:", e);
    return [];
  }
}

export default async function Page() {
  const [categories, medias] = await Promise.all([
    getSafeCategories(),
    getSafeMedias(),
  ]);

  return <CategoryForm categories={categories} medias={medias} />;
}
