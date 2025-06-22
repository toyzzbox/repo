import { prisma } from "@/lib/prisma";
import { Attribute } from "@/types/attribute";

/**
 * "Yaş Aralığı" grubuna ait attribute'ları getirir
 */
export async function getAttributes(): Promise<Attribute[]> {
  try {
    const group = await prisma.attributeGroup.findFirst({
      where: {
        name: "Yaş Aralığı",
      },
      include: {
        attributes: {
          include: {
            medias: true,
          },
        },
      },
    });

    return group?.attributes ?? [];
  } catch (error) {
    console.error("Yaş Aralığı attribute'ları alınamadı:", error);
    return [];
  }
}
