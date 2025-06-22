
import { prisma } from "@/lib/prisma";
import { Attribute } from "@/types/attribute";




export async function getAttributes(): Promise<Attribute[]> {
  try {
    const attributes = await prisma.attribute.findMany({
      include: {
        medias: true,
      },
    });

    return attributes as Attribute[];
  } catch (error) {
    console.error("Ürünler alınamadı:", error);
    return [];
  }
}
