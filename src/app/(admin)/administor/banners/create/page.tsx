import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import CreateBannerForm from "../CreateBannerForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SafeMedia = {
  id: string;
  urls: string[];
  title: string | null;
  altText: string | null;
  type: string; // enum ise string tutmak yeterli
};

export default async function Page() {
  let safeMedias: SafeMedia[] = [];

  try {
    const medias = await prisma.media.findMany({
      include: { variants: true },
      orderBy: { createdAt: "desc" },
    });

    safeMedias = medias.map((media) => ({
      id: media.id,
      urls: media.variants.map((v) => v.cdnUrl),
      title: media.title ?? null,
      altText: media.altText ?? null,
      type: String(media.type),
    }));
  } catch (e) {
    console.error("Create banner medias fetch failed:", e);
    // DB yoksa bile say
