import { PrismaClient, MediaType, VariantType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding started...");

  /* ======================
     MEDIA: LEGO LOGO
  ====================== */
  const legoLogo = await prisma.media.upsert({
    where: { id: "media_lego_logo" },
    update: {
      type: MediaType.LOGO,
      title: "LEGO Logo",
      altText: "LEGO markasının logosu",
    },
    create: {
      id: "media_lego_logo",
      type: MediaType.LOGO,
      title: "LEGO Logo",
      altText: "LEGO markasının logosu",
      variants: {
        create: [
          {
            key: "main",
            cdnUrl: "https://toyzzbox.s3.eu-north-1.amazonaws.com/seed/lego-logo.png",
            format: "png",
            width: 512,
            height: 512,
            size: 100_000,
            type: VariantType.ORIGINAL,
          },
        ],
      },
    },
    include: { variants: true },
  });

  // Variants idempotent olsun diye: varsa güncelle/yoksa ekle
  await prisma.mediaVariant.upsert({
    where: { mediaId_key: { mediaId: legoLogo.id, key: "main" } }, // ✅ composite unique lazım
    update: {
      cdnUrl: "https://toyzzbox.s3.eu-north-1.amazonaws.com/seed/lego-logo.png",
      format: "png",
      width: 512,
      height: 512,
      size: 100_000,
      type: VariantType.ORIGINAL,
    },
    create: {
      mediaId: legoLogo.id,
      key: "main",
      cdnUrl: "https://toyzzbox.s3.eu-north-1.amazonaws.com/seed/lego-logo.png",
      format: "png",
      width: 512,
      height: 512,
      size: 100_000,
      type: VariantType.ORIGINAL,
    },
  });

  /* ======================
     BRAND: LEGO
  ====================== */
  const lego = await prisma.brand.upsert({
    where: { slug: "lego" },
    update: {
      name: "LEGO",
      medias: { set: [{ id: legoLogo.id }] }, // ✅ tekrar çalıştırınca da aynı kalsın
    },
    create: {
      name: "LEGO",
      slug: "lego",
      medias: { connect: [{ id: legoLogo.id }] },
    },
  });

  /* ======================
     CATEGORY: OYUNCAKLAR
  ====================== */
  const toys = await prisma.category.upsert({
    where: { slug: "oyuncaklar" },
    update: {
      name: "Oyuncaklar",
      description: "Tüm oyuncak çeşitlerinin bulunduğu ana kategori.",
    },
    create: {
      name: "Oyuncaklar",
      slug: "oyuncaklar",
      description: "Tüm oyuncak çeşitlerinin bulunduğu ana kategori.",
    },
  });

  /* ======================
     PRODUCT GROUP: LEGO CITY
     (slug unique olmalı)
  ====================== */
  const legoCityGroup = await prisma.productGroup.upsert({
    where: { slug: "lego-city" },
    update: {
      name: "LEGO City Setleri",
    },
    create: {
      name: "LEGO City Setleri",
      slug: "lego-city",
    },
  });

  /* ======================
     MEDIA: PRODUCT IMAGE
  ====================== */
  const productMedia = await prisma.media.upsert({
    where: { id: "media_lego_city_car" },
    update: {
      type: MediaType.IMAGE,
      title: "LEGO City Spor Araba",
      altText: "LEGO City serisinden kırmızı spor araba",
    },
    create: {
      id: "media_lego_city_car",
      type: MediaType.IMAGE,
      title: "LEGO City Spor Araba",
      altText: "LEGO City serisinden kırmızı spor araba",
      variants: {
        create: [
          {
            key: "original",
            cdnUrl: "https://toyzzbox.s3.eu-north-1.amazonaws.com/seed/lego-city-car.jpg",
            format: "jpg",
            width: 800,
            height: 600,
            size: 240_000,
            type: VariantType.ORIGINAL,
          },
          {
            key: "thumbnail",
            cdnUrl: "https://toyzzbox.s3.eu-north-1.amazonaws.com/seed/lego-city-car-thumb.jpg",
            format: "jpg",
            width: 300,
            height: 200,
            size: 40_000,
            type: VariantType.THUMBNAIL,
          },
        ],
      },
    },
  });

  // product media variants idempotent
  await prisma.mediaVariant.upsert({
    where: { mediaId_key: { mediaId: productMedia.id, key: "original" } },
    update: {
      cdnUrl: "https://toyzzbox.s3.eu-north-1.amazonaws.com/seed/lego-city-car.jpg",
      format: "jpg",
      width: 800,
      height: 600,
      size: 240_000,
      type: VariantType.ORIGINAL,
    },
    create: {
      mediaId: productMedia.id,
      key: "original",
      cdnUrl: "https://toyzzbox.s3.eu-north-1.amazonaws.com/seed/lego-city-car.jpg",
      format: "jpg",
      width: 800,
      height: 600,
      size: 240_000,
      type: VariantType.ORIGINAL,
    },
  });

  await prisma.mediaVariant.upsert({
    where: { mediaId_key: { mediaId: productMedia.id, key: "thumbnail" } },
    update: {
      cdnUrl:
        "https://toyzzbox.s3.eu-north-1.amazonaws.com/seed/lego-city-car-thumb.jpg",
      format: "jpg",
      width: 300,
      height: 200,
      size: 40_000,
      type: VariantType.THUMBNAIL,
    },
    create: {
      mediaId: productMedia.id,
      key: "thumbnail",
      cdnUrl:
        "https://toyzzbox.s3.eu-north-1.amazonaws.com/seed/lego-city-car-thumb.jpg",
      format: "jpg",
      width: 300,
      height: 200,
      size: 40_000,
      type: VariantType.THUMBNAIL,
    },
  });

  /* ======================
     PRODUCT
  ====================== */
  const product = await prisma.product.upsert({
    where: { slug: "lego-city-spor-araba" },
    update: {
      name: "LEGO City Spor Araba",
      price: 499.9,
      stock: 12,
      description: "LEGO City serisinden mükemmel bir spor araba seti!",
      barcode: "1234567890123",
      isActive: true,
      groupId: legoCityGroup.id,
      brands: { set: [{ id: lego.id }] },
      categories: { set: [{ id: toys.id }] },
    },
    create: {
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
    },
  });

  // ✅ ProductMedia join tablosu idempotent:
  await prisma.productMedia.upsert({
    where: {
      productId_mediaId: { productId: product.id, mediaId: productMedia.id }, // ✅ composite unique lazım
    },
    update: { order: 0 },
    create: { productId: product.id, mediaId: productMedia.id, order: 0 },
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
