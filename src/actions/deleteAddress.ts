
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function deleteAddress(id: string) {
  const session = await getSession();
  const userId = session?.user?.id;

  if (!userId) return false;

  await prisma.address.deleteMany({
    where: {
      id,
      userId,
    },
  });

  revalidatePath("/hesabim/addresses");
  return true;
}
