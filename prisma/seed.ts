import { prisma } from "@/lib/prisma";
import { MediaType, VariantType } from "@prisma/client";

async function main() {
  console.log("🌱 Seeding...");

  // --- Marka logosu için Media oluştur ---
  const legoLogo = await prisma.media.create({
    data: {
      type: MediaType.LOGO,
      title: "LEGO Logo",
      altText: "LEGO markasının logosu",
      variants: {
        create: [
          {
            key: "main",
            cdnUrl:
              "https://toyzzbox.s3.eu-north-1.amazonaws.com/seed/lego-logo.png",
            format: "png",
            width: 512,
            height: 512,
            size: 100000,
            type: VariantType.ORIGINAL,
          },
        ],
      },
    },
  });

  // --- Marka oluştur ---
  const lego = await prisma.brand.upsert({
    where: { slug: "lego" },
    update: {},
    create: {
      name: "LEGO",
      slug: "lego",
      medias: {
        connect: [{ id: legoLogo.id }],
      },
    },
  });

  // --- Kategori ---
  const toys = await prisma.category.upsert({
    where: { slug: "oyuncaklar" },
    update: {},
    create: {
      name: "Oyuncaklar",
      slug: "oyuncaklar",
      description: "Tüm oyuncak çeşitlerinin bulunduğu ana kategori.",
    },
  });

  // --- Ürün Grubu ---
  const legoCityGroup = await prisma.productGroup.upsert({
    where: { slug: "lego-city" },
    update: {},
    create: {
      name: "LEGO City Setleri",
      slug: "lego-city",
    },
  });

  // --- Ürün görseli (Media) ---
  const productMedia = await prisma.media.create({
    data: {
      type: MediaType.IMAGE,
      title: "LEGO City Spor Araba",
      altText: "LEGO City serisinden kırmızı spor araba",
      variants: {
        create: [
          {
            key: "original",
            cdnUrl:
              "https://toyzzbox.s3.eu-north-1.amazonaws.com/seed/lego-city-car.jpg",
            format: "jpg",
            width: 800,
            height: 600,
            size: 240000,
            type: VariantType.ORIGINAL,
          },
          {
            key: "webp",
            cdnUrl:
              "https://toyzzbox.s3.eu-north-1.amazonaws.com/seed/lego-city-car.webp",
            format: "webp",
            width: 800,
            height: 600,
            size: 120000,
            type: VariantType.WEBP,
          },
        ],
      },
    },
  });

  // --- Ürün ---
  await prisma.product.create({
    data: {
      name: "LEGO City Spor Araba",
      slug: "lego-city-spor-araba",
      price: 499.9,
      stock: 12,
      description: "LEGO City serisinden mükemmel bir spor araba seti!",
      barcode: "1234567890123",
      isActive: true,
      groupId: legoCityGroup.id,
      brands: { connect: [{ id: lego.id }] },
      categories: { connect: [{ id: toys.id }] },
      medias: {
        create: [
          {
            mediaId: productMedia.id,
            order: 0,
          },
        ],
      },
    },
  });

  console.log("✅ Seed işlemi başarıyla tamamlandı!");
}

main()
  .catch((e) => {
    console.error("❌ Seed hatası:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
