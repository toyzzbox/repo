
import { prisma } from "@/lib/prisma";
import CreateAttributeForm from "./CreateAttributeForm";

async function getAttributes() {
    try {
        const attributes = await prisma.attributeGroup.findMany();
        return attributes;
    } catch (error) {
        console.error("Error fetching attributes:", error);
        return [];
    }
}

export default async function CreateAttribute() {
    const attributeGroups = await getAttributes(); // Değişken adı düzeltildi

    return (
        <div className='w-full max-w-6xl mx-auto text-center h-screen'>
            <h1 className='font-bold text-2xl mt-20 mb-10'>Create New Category</h1>
            <CreateAttributeForm attributeGroups={attributeGroups} /> {/* Prop adı düzeltildi */}
        </div>
    );
}
