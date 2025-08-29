nelde root'a koyuluyor (app/auth.ts)
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function getAddresses() {
  const session = await getSession();

  if (!session?.user?.id) return [];

  return prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
}
