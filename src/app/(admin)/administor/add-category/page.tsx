import { prisma } from '@/lib/prisma';
import CategoryForm from './CategoryForm';

async function getCategories() {
  return await prisma.category.findMany();
}

export default async function Page() {
  const categories = await getCategories(); // Kategorileri çek
  const medias = await prisma.media.findMany(); // Mediaları çek
  const safeMedias = JSON.parse(JSON.stringify(medias)); // Serialize et

  return <CategoryForm categories={categories} medias={safeMedias} />;
}
