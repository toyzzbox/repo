import { prisma } from "@/lib/prisma";


async function main() {
  // --- Brand ---
  const lego = await prisma.brand.upsert({
    where: { slug: 'lego' },
    update: {},
    create: {
      name: 'LEGO',
      slug: 'lego',
      medias: {
        create: {
          type: 'IMAGE',
          files: {
            create: [
              {
                url: 'https://toyzzbox.s3.eu-north-1.amazonaws.com/seed/lego-logo.png',
                key: 'seed/lego-logo.png',
              },
            ],
          },
        },
      },
    },
  });

  // --- Category ---
  const toys = await prisma.category.upsert({
    where: { slug: 'oyuncaklar' },
    update: {},
    create: {
      name: 'Oyuncaklar',
      slug: 'oyuncaklar',
    },
  });

  // --- Product Group ---
  const legoCityGroup = await prisma.productGroup.upsert({
    where: { slug: 'lego-city' },
    update: {},
    create: {
      name: 'LEGO City Setleri',
      slug: 'lego-city',
    },
  });

  // --- Media (Product Image) ---
  const productMedia = await prisma.media.create({
    data: {
      type: 'IMAGE',
      files: {
        create: [
          {
            url: 'https://toyzzbox.s3.eu-north-1.amazonaws.com/seed/lego-city-car.jpg',
            key: 'seed/lego-city-car.jpg',
          },
        ],
      },
    },
  });

  // --- Product ---
  await prisma.product.create({
    data: {
      name: 'LEGO City Spor Araba',
      slug: 'lego-city-spor-araba',
      price: 499.9,
      stock: 12,
      description: 'LEGO City serisinden mükemmel bir spor araba!',
      barcode: '1234567890123',
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

  console.log('✅ Seed data başarıyla eklendi!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
