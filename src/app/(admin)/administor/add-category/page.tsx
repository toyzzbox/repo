
import { prisma } from '@/lib/prisma';
import CategoryForm from './CategoryForm';


async function getCategories() {
    const categories = await prisma.category.findMany();
    return categories; // categories'i döndürüyoruz
}


export default async function Page() {
    const categories = await getCategories(); // await ile getCategories çağrısı


    return <CategoryForm categories={categories} />;
}


