// app/categories/[...slug]/page.tsx
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/(frontend)/product/ProductCard'


interface PageProps {
  params: {
    slug: string[]
  }
}

// Kategori ve ürünlerini getiren fonksiyon
async function getCategoryWithProducts(slug: string) {
  const category = await prisma.category.findUnique({
    where: {
      slug: slug
    },
    include: {
      products: {
        include: {
          medias: true,
          variants: true,
          categories: true
        }
      },
      parent: true,
      children: {
        select: {
          id: true,
          name: true,
          slug: true,
          description: true
        }
      },
      medias: true
    }
  })

  return category
}

// Breadcrumb için kategori hiyerarşisini getir
async function getCategoryHierarchy(slug: string) {
  const hierarchy = []
  let currentSlug = slug
  
  while (currentSlug) {
    const category = await prisma.category.findUnique({
      where: { slug: currentSlug },
      include: { parent: true }
    })
    
    if (!category) break
    
    hierarchy.unshift({
      id: category.id,
      name: category.name,
      slug: category.slug
    })
    
    currentSlug = category.parent?.slug || null
  }
  
  return hierarchy
}

export default async function CategoryPage({ params }: PageProps) {
  // URL'den son slug'ı al (en alt kategori)
  const categorySlug = params.slug[params.slug.length - 1]
  
  // Kategori ve ürünlerini getir
  const category = await getCategoryWithProducts(categorySlug)
  
  if (!category) {
    notFound()
  }
  
  // Breadcrumb için hiyerarşi
  const hierarchy = await getCategoryHierarchy(categorySlug)
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}

      
      {/* Kategori Başlığı */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-gray-600 text-lg">
            {category.description}
          </p>
        )}
      </div>
      
      {/* Alt Kategoriler (varsa) */}
      {category.children.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Alt Kategoriler</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {category.children.map((child) => (
              <a
                key={child.id}
                href={`/categories/${params.slug.join('/')}/${child.slug}`}
                className="block p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium">{child.name}</h3>
                {child.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {child.description}
                  </p>
                )}
              </a>
            ))}
          </div>
        </div>
      )}
      
      {/* Ürünler */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            Ürünler ({category.products.length})
          </h2>
          
          {/* Sıralama dropdown'ı (opsiyonel) */}
          <select className="border rounded px-3 py-1">
            <option>Varsayılan Sıralama</option>
            <option>Fiyat: Düşükten Yükseğe</option>
            <option>Fiyat: Yüksekten Düşüğe</option>
            <option>Yeni Ürünler</option>
          </select>
        </div>
        
        {category.products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {category.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Bu kategoride henüz ürün bulunmuyor
            </h3>
            <p className="text-gray-600">
              Yakında yeni ürünler eklenecek
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// SEO için metadata
export async function generateMetadata({ params }: PageProps) {
  const categorySlug = params.slug[params.slug.length - 1]
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    select: { name: true, description: true }
  })
  
  if (!category) {
    return {
      title: 'Kategori Bulunamadı'
    }
  }
  
  return {
    title: `${category.name} - Ürünler`,
    description: category.description || `${category.name} kategorisindeki tüm ürünler`,
  }
}