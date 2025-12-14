import { prisma } from "@/lib/prisma";
import { Attribute } from "@/types/attribute";

export async function getAttributes(): Promise<Attribute[]> {
  try {
    const group = await prisma.attributeGroup.findFirst({
      where: {
        name: "Yaş Aralığı",
      },
      include: {
        attributes: {
          include: {
            medias: {
              include: {
                variants: {
                  select: {
                    cdnUrl: true,
                    key: true,
                    type: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return (group?.attributes ?? []) as Attribute[];
  } catch (error) {
    console.error("Yaş Aralığı attribute'ları alınamadı:", error);
    return [];
  }
}
