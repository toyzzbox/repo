import { auth } from "@/auth"; // Genelde root'a koyuluyor (app/auth.ts)
import { prisma } from "@/lib/prisma";

export async function getAddresses() {
  const session = await auth();

  if (!session?.user?.id) return [];

  return prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
}
