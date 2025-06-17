import { prisma } from "@/lib/prisma";


/**
 * Belirtilen slug'a sahip bir kategori ve onun tüm alt kategorilerindeki ürünleri getirir.
 *
 * @param targetCategorySlug - Ürünleri getirmek istediğiniz ana kategorinin slug'ı.
 * @param filters - minPrice, maxPrice ve sort gibi filtreleri içeren bir obje.
 * @returns Kategori ve alt kategorilerindeki ürünlerin listesi.
 */
export async function getProductsInTargetCategoryAndSubcategories(
  targetCategorySlug: string,
  filters: {
    minPrice?: string | number;
    maxPrice?: string | number;
    sort?: string | string[];
  } = {} // Varsayılan boş bir obje
) {
  // Fiyat filtrelerini sayıya dönüştür
  const minPrice = filters.minPrice ? Number(filters.minPrice) : undefined;
  const maxPrice = filters.maxPrice ? Number(filters.maxPrice) : undefined;

  // CTE (Common Table Expression) kullanarak hedef kategori ve tüm alt kategorilerinin ID'lerini bulur.
  // Bu sorgu, bir kategorinin ve onun tüm çocuklarının (torunları dahil) ID'lerini hiyerarşik olarak çeker.
  const categoryIds = await prisma.$queryRaw<{ id: string }[]>`
    WITH RECURSIVE CategoryTree AS (
      -- Base Case: Hedef kategoriyi seçer
      SELECT id, "parentId"
      FROM "Category"
      WHERE slug = ${targetCategorySlug}

      UNION ALL

      -- Recursive Case: Mevcut ağaçtaki kategorilerin çocuklarını seçer
      SELECT c.id, c."parentId"
      FROM "Category" c
      INNER JOIN CategoryTree ct ON c."parentId" = ct.id
    )
    SELECT id FROM CategoryTree;
  `;

  // Eğer hiçbir kategori bulunamazsa, boş bir dizi döndür.
  if (categoryIds.length === 0) {
    console.log(`Uyarı: '${targetCategorySlug}' slug'ına sahip kategori veya alt kategorileri bulunamadı.`);
    return [];
  }

  // Bulunan tüm kategori ID'lerini bir diziye dönüştür
  const idsToFilter = categoryIds.map(cat => cat.id);
  console.log(`'${targetCategorySlug}' için bulunan kategori ID'leri (alt kategoriler dahil):`, idsToFilter);


  // Ürünleri bulanan kategori ID'lerine göre filtreleyerek getir.
  const products = await prisma.product.findMany({
    where: {
      categories: {
        some: {
          id: {
            in: idsToFilter, // CTE'den gelen tüm ilgili kategori ID'lerini kullanır
          },
        },
      },
      // Fiyat filtrelerini uygula
      price: {
        gte: minPrice,
        lte: maxPrice,
      },
      isActive: true, // Sadece aktif ürünleri getir
    },
    include: {
      medias: true, // Ürün görsellerini dahil et
      brands: true, // Ürün markalarını dahil et
      categories: { // Ürünün ait olduğu kategorileri (ID, isim, slug) dahil et
        select: {
          id: true,
          name: true,
          slug: true
        }
      }
    },
    orderBy: getOrderBy(filters.sort), // Sıralama filtrelerini uygula
  });

  console.log(`Bulunan ürün sayısı: ${products.length}`);
  return products;
}

// Sıralama mantığı (önceki kodunuzdan alındı)
function getOrderBy(sort?: string | string[]) {
  const sortValue = Array.isArray(sort) ? sort[0] : sort;

  switch (sortValue) {
    case 'price-asc':
      return { price: 'asc' };
    case 'price-desc':
      return { price: 'desc' };
    case 'newest':
      return { createdAt: 'desc' };
    default:
      return { name: 'asc' }; // Varsayılan olarak isme göre sırala
  }
}

// --- Kullanım Örneği ---
async function main() {
  try {
    // Örnek kullanım: 'elektronik' slug'ına sahip kategori ve altındaki tüm ürünleri getir
    const electronicsProducts = await getProductsInTargetCategoryAndSubcategories('elektronik', {
      minPrice: 50,
      maxPrice: 5000,
      sort: 'price-desc'
    });
    // console.log('Elektronik ve alt kategorilerdeki ürünler:', electronicsProducts);

    // Başka bir örnek: 'telefon' slug'ına sahip kategori ve altındaki tüm ürünleri sadece en yenilere göre sırala
    const phoneProducts = await getProductsInTargetCategoryAndSubcategories('telefon', {
      sort: 'newest'
    });
    // console.log('Telefon ve alt kategorilerdeki ürünler:', phoneProducts);

  } catch (error) {
    console.error("Ürünleri çekerken bir hata oluştu:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// main(); // Test etmek için bu satırı yorumdan kaldırabilirsiniz.