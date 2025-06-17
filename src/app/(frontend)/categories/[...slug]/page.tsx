// app/category/[...slug]/page.tsx
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma'; // Prisma istemcinizi import ettiğiniz yol
import { ProductList } from '@/components/(frontend)/product/Product-List';
import { CategoryBreadcrumbs } from '@/components/(frontend)/category/Category-Breadcrumbs';
import { CategoryFilters } from '@/components/(frontend)/category/Category-Filters';

// Bu fonksiyonu projenizde ayrı bir dosyaya taşımanız önerilir (örneğin: '@/lib/queries/product-queries').
// Şimdilik buraya dahil ettim.
/**
 * Belirtilen slug'a sahip bir kategori ve onun tüm alt kategorilerindeki ürünleri getirir.
 *
 * @param targetCategorySlug - Ürünleri getirmek istediğiniz ana kategorinin slug'ı.
 * @param filters - minPrice, maxPrice ve sort gibi filtreleri içeren bir obje.
 * @returns Kategori ve alt kategorilerindeki ürünlerin listesi.
 */
async function getProductsInTargetCategoryAndSubcategories(
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
  const categoryIds = await prisma.$queryRaw<{ id: string }>`
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

  if (categoryIds.length === 0) {
    // console.log(`Uyarı: '${targetCategorySlug}' slug'ına sahip kategori veya alt kategorileri bulunamadı.`);
    return [];
  }

  const idsToFilter = categoryIds.map(cat => cat.id);
  // console.log(`'${targetCategorySlug}' için bulunan kategori ID'leri (alt kategoriler dahil):`, idsToFilter);

  // Ürünleri bulanan kategori ID'lerine göre filtreleyerek getir.
  return await prisma.product.findMany({
    where: {
      categories: {
        some: {
          id: {
            in: idsToFilter,
          },
        },
      },
      price: {
        gte: minPrice,
        lte: maxPrice,
      },
      isActive: true, // Sadece aktif ürünleri getir
    },
    include: {
      medias: true,
      brands: true,
      categories: {
        select: {
          id: true,
          name: true,
          slug: true
        }
      }
    },
    orderBy: getOrderBy(filters.sort),
  });
}

// Sıralama mantığı (değişiklik yok)
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
      return { name: 'asc' };
  }
}

// getCategoryWithHierarchy fonksiyonu (değişiklik yok)
async function getCategoryWithHierarchy(slugPath: string) {
  const formattedPath = slugPath.replace(/-/g, '/');
  const slugs = formattedPath.split('/');

  // En spesifik kategoriyi bul (son segment)
  const targetSlug = slugs[slugs.length - 1];

  const category = await prisma.category.findUnique({
    where: {
      slug: targetSlug
    },
    include: {
      parent: {
        include: {
          parent: true
        }
      },
      children: true
    }
  });

  // Kategori hiyerarşisini doğrula
  if (slugs.length > 1) {
    let current = category;
    for (let i = slugs.length - 2; i >= 0; i--) {
      if (!current?.parent || current.parent.slug !== slugs[i]) {
        return null;
      }
      current = current.parent;
    }
  }

  return category;
}

// --- Ana Sayfa Bileşeni ---
interface Params {
  slug: string[];
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { sort, minPrice, maxPrice, ...filters } = searchParams;
  const slugPath = params.slug.join('/'); // URL'deki slug dizisini birleştirir (örn: 'elektronik/telefon')

  // Ürünleri getirmek için kullanılacak hedef kategori slug'ını alır (en sondaki slug)
  const slugs = slugPath.split('/');
  const targetCategorySlug = slugs[slugs.length - 1];

  // Kategori detaylarını ve ilgili ürünleri paralel olarak çeker
  const [category, filteredProducts] = await Promise.all([
    getCategoryWithHierarchy(slugPath), // Kategori hiyerarşisini ve detaylarını getirir
    getProductsInTargetCategoryAndSubcategories(targetCategorySlug, { sort, minPrice, maxPrice }), // Kategori ve altındaki ürünleri getirir
  ]);

  // Kategori bulunamazsa 404 sayfasına yönlendir
  if (!category) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CategoryBreadcrumbs category={category} />
      <div className="my-6">
        <h1 className="text-3xl font-bold">{category.name}</h1>
        {category.description && (
          <p className="text-gray-600 mt-2">{category.description}</p>
        )}
      </div>
      <CategoryFilters />
      <ProductList
        products={filteredProducts}
        subcategories={category.children}
      />
    </div>
  );
}