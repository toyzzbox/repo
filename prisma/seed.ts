import { prisma } from "@/lib/prisma";

async function main() {
  // --- Marka ---
  const lego = await prisma.brand.upsert({
    where: { slug: "lego" },
    update: {},
    create: {
      name: "LEGO",
      slug: "lego",
      medias: {
        create: {
          type: "image",
          files: {
            create: [
              {
                url: "https://toyzzbox.s3.eu-north-1.amazonaws.com/seed/lego-logo.png",
                format: "png",
                quality: "high",
              },
            ],
          },
        },
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
     description: 'Tüm oyuncak çeşitlerinin bulunduğu ana kategori.',

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
      type: "image",
      files: {
        create: [
          {
            url: "https://toyzzbox.s3.eu-north-1.amazonaws.com/seed/lego-city-car.jpg",
            format: "jpg",
            width: 800,
            height: 600,
            size: 240000,
            quality: "high",
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

  console.log("✅ Seed data başarıyla eklendi!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
