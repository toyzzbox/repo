import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma' // Prisma client'ınızın yolu
import Link from 'next/link'
import Image from 'next/image'

interface CategoryPageProps {
  params: {
    slug: string[]
  }
}

// Kategoriyi slug'a göre bulma fonksiyonu
async function getCategoryBySlug(slugArray: string[]) {
  const lastSlug = slugArray[slugArray.length - 1]
  
  const category = await prisma.category.findUnique({
    where: {
      slug: lastSlug
    },
    include: {
      children: {
        include: {
          medias: true,
          _count: {
            select: {
              products: true
            }
          }
        }
      },
      parent: true,
      products: {
        include: {
          medias: true
        }
      },
      medias: true
    }
  })

  if (!category) {
    return null
  }

  // Slug hierarchy doğrulaması (opsiyonel)
  // URL'deki slug sırasının kategori hiyerarşisine uygun olup olmadığını kontrol eder
  if (slugArray.length > 1) {
    let currentCategory = category
    for (let i = slugArray.length - 2; i >= 0; i--) {
      if (!currentCategory.parent || currentCategory.parent.slug !== slugArray[i]) {
        return null
      }
      currentCategory = currentCategory.parent
    }
  }

  return category
}

// Breadcrumb için kategori hiyerarşisini alma
async function getCategoryHierarchy(category: any): Promise<any[]> {
  const hierarchy = [category]
  let current = category

  while (current.parent) {
    current = await prisma.category.findUnique({
      where: { id: current.parentId },
      include: { parent: true }
    })
    if (current) {
      hierarchy.unshift(current)
    }
  }

  return hierarchy
}

// Metadata oluşturma
export async function generateMetadata({ params }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.slug)
  
  if (!category) {
    return {
      title: 'Kategori Bulunamadı',
      description: 'Aradığınız kategori bulunamadı.'
    }
  }

  return {
    title: category.name,
    description: category.description,
    openGraph: {
      title: category.name,
      description: category.description,
      images: category.medias.length > 0 ? [category.medias[0].url] : []
    }
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.slug)

  if (!category) {
    notFound()
  }

  const hierarchy = await getCategoryHierarchy(category)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li>
            <Link href="/" className="hover:text-blue-600">
              Ana Sayfa
            </Link>
          </li>
          {hierarchy.map((cat, index) => (
            <li key={cat.id} className="flex items-center">
              <span className="mx-2">/</span>
              {index === hierarchy.length - 1 ? (
                <span className="text-gray-900 font-medium">{cat.name}</span>
              ) : (
                <Link 
                  href={`/categories/${hierarchy.slice(0, index + 1).map(c => c.slug).join('/')}`}
                  className="hover:text-blue-600"
                >
                  {cat.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Kategori Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-gray-600 text-lg">
                {category.description}
              </p>
            )}
          </div>
          
          {/* Kategori Görseli */}
          {category.medias.length > 0 && (
            <div className="ml-6">
              <Image
                src={category.medias[0].url}
                alt={category.name}
                width={200}
                height={200}
                className="rounded-lg object-cover"
              />
            </div>
          )}
        </div>
      </div>

      {/* Alt Kategoriler */}
      {category.children.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Alt Kategoriler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {category.children.map((child) => (
              <Link
                key={child.id}
                href={`/categories/${params.slug.join('/')}/${child.slug}`}
                className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 border"
              >
                {child.medias.length > 0 && (
                  <div className="mb-3">
                    <Image
                      src={child.medias[0].url}
                      alt={child.name}
                      width={300}
                      height={200}
                      className="w-full h-32 object-cover rounded"
                    />
                  </div>
                )}
                <h3 className="font-semibold text-lg mb-2">{child.name}</h3>
                {child.description && (
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {child.description}
                  </p>
                )}
                <div className="text-sm text-blue-600">
                  {child._count.products} ürün
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Ürünler */}
      {category.products.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">
            Ürünler ({category.products.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {category.products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border"
              >
                {product.medias.length > 0 && (
                  <div className="aspect-square">
                    <Image
                      src={product.medias[0].url}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                      {product.description}
                    </p>
                  )}
                  {product.price && (
                    <div className="text-lg font-bold text-blue-600">
                      ₺{product.price.toLocaleString('tr-TR')}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Boş durum */}
      {category.children.length === 0 && category.products.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">
            Bu kategoride henüz ürün veya alt kategori bulunmuyor.
          </div>
        </div>
      )}
    </div>
  )
}

// Static params generation (opsiyonel - ISR için)
export async function generateStaticParams() {
  const categories = await prisma.category.findMany({
    include: {
      parent: true
    }
  })

  const paths: { slug: string[] }[] = []

  // Her kategori için tüm olası slug kombinasyonlarını oluştur
  for (const category of categories) {
    const slugPath = []
    let current = category

    // Slug yolunu oluştur
    while (current) {
      slugPath.unshift(current.slug)
      current = current.parent
    }

    paths.push({ slug: slugPath })
  }

  return paths
}