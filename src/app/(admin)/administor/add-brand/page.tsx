import { prisma } from "@/lib/prisma";
import BrandForm from "./BrandForm";

export default async function Page() {
    const medias = await prisma.media.findMany(); // Mediaları çek
    const safeMedias = JSON.parse(JSON.stringify(medias)); 
    return (
        <BrandForm medias={safeMedias}/> // ProductForm kullan ve media verisini ilet
    );
}
