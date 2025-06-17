import { notFound } from 'next/navigation';
import { getCategoryWithProducts } from '@/lib/prisma-queries';
import Image from 'next/image';
import Link from 'next/link';

interface CategoryPageProps {
  params: {
    slug: string[];
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;
  
  // Son slug'ı al (en spesifik kategori)
  const categorySlug = slug[slug.length - 1];
  
  const data = await getCategoryWithProducts(categorySlug);
  
  if (!data) {
    notFound();
  }

  const { category, products, totalProducts } = data;

  // Breadcrumb için kategori hiyerarşisini oluştur
  const breadcrumbs = await getBreadcrumbs(categorySlug);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Ana Sayfa
            </Link>
          </li>
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.id}>
              <div className="flex items-center">
                <svg
                  className="w-3 h-3 text-gray-400 mx-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                {index === breadcrumbs.length - 1 ? (
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    href={`/kategori/${crumb.fullPath}`}
                    className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2"
                  >
                    {crumb.name}
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ol>
      </nav>

      {/* Kategori Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {category.name}
        </h1>
        
        {category.description && (
          <p className="text-gray-600 text-lg mb-6">
            {category.description}
          </p>
        )}

        {/* Kategori Görseli */}
        {category.medias.length > 0 && (
          <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden">
            <Image
              src={category.medias[0].url}
              alt={category.name}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Alt Kategoriler */}
        {category.children.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Alt Kategoriler</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {category.children.map((child) => (
                <Link
                  key={child.id}
                  href={`/kategori/${slug.join('/')}/${child.slug}`}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-medium text-gray-900">{child.name}</h3>
                  {child.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {child.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Ürünler Bölümü */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Ürünler
          </h2>
          <span className="text-gray-500">
            {totalProducts} ürün bulundu
          </span>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Bu kategoride henüz ürün bulunmuyor.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Ürün Görseli */}
                {product.medias.length > 0 && (
                  <div className="relative w-full h-48">
                    <Image
                      src={product.medias[0].url}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  
                  {product.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  {product.price && (
                    <p className="text-lg font-bold text-blue-600 mb-3">
                      ₺{product.price}
                    </p>
                  )}

                  {/* Ürünün Kategorileri */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {product.categories.map((cat) => (
                      <span
                        key={cat.id}
                        className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/urun/${product.slug}`}
                    className="block w-full bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Detayları Gör
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Breadcrumb için kategori hiyerarşisini getiren fonksiyon
async function getBreadcrumbs(categorySlug: string) {
  const { prisma } = await import('@/lib/prisma');
  
  const breadcrumbs = [];
  let currentSlug = categorySlug;
  
  while (currentSlug) {
    const category = await prisma.category.findUnique({
      where: { slug: currentSlug },
      select: {
        id: true,
        name: true,
        slug: true,
        parent: {
          select: {
            slug: true
          }
        }
      }
    });
    
    if (!category) break;
    
    breadcrumbs.unshift({
      id: category.id,
      name: category.name,
      slug: category.slug,
      fullPath: await getFullPath(category.slug)
    });
    
    currentSlug = category.parent?.slug || '';
  }
  
  return breadcrumbs;
}

// Kategori için tam path'i oluşturan fonksiyon
async function getFullPath(categorySlug: string): Promise<string> {
  const { prisma } = await import('@/lib/prisma');
  
  const pathSegments = [];
  let currentSlug = categorySlug;
  
  while (currentSlug) {
    const category = await prisma.category.findUnique({
      where: { slug: currentSlug },
      select: {
        slug: true,
        parent: {
          select: {
            slug: true
          }
        }
      }
    });
    
    if (!category) break;
    
    pathSegments.unshift(category.slug);
    currentSlug = category.parent?.slug || '';
  }
  
  return pathSegments.join('/');
}

// SEO için metadata
export async function generateMetadata({ params }: CategoryPageProps) {
  const categorySlug = params.slug[params.slug.length - 1];
  const data = await getCategoryWithProducts(categorySlug);
  
  if (!data) {
    return {
      title: 'Kategori Bulunamadı'
    };
  }

  return {
    title: `${data.category.name} - Kategorisi`,
    description: data.category.description || `${data.category.name} kategorisindeki ürünleri keşfedin.`,
  };
}