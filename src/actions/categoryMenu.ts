'use server'

import { prisma } from '@/lib/prisma'

// Tüm ana kategorileri ve alt kategorilerini getir
export async function getMegaMenuCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        parentId: null, // Sadece ana kategoriler
      },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        
        // Alt kategorileri getir (1. seviye)
        children: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            
            // Alt kategorilerin alt kategorileri (2. seviye)
            children: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                name: true,
                slug: true,
                _count: {
                  select: { products: true }
                }
              }
            },
            
            _count: {
              select: { products: true }
            }
          }
        },
        
        _count: {
          select: { products: true }
        },
        
        medias: {
          take: 1,
          select: {
            url: true,
            altText: true
          }
        }
      }
    })
    
    // Veriyi formatla
    return categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.medias[0]?.url || null,
      productCount: category._count.products,
      
      subcategories: category.children.map(subcat => ({
        id: subcat.id,
        title: subcat.name,
        slug: subcat.slug,
        description: subcat.description,
        productCount: subcat._count.products,
        
        items: subcat.children.map(item => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          productCount: item._count.products
        }))
      }))
    }))
  } catch (error) {
    console.error('getMegaMenuCategories error:', error)
    return []
  }
}
