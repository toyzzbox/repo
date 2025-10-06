// src/components/MegaMenuServer.tsx
import { prisma } from '@/lib/prisma';
import { ChevronDown, Package } from 'lucide-react';

export default async function MegaMenuServer() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: {
      children: {
        include: { children: true }
      }
    },
    orderBy: { order: 'asc' },
  });

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center space-x-1">
          {categories.map((cat) => (
            <div key={cat.id} className="group relative">
              {/* Ana kategori butonu */}
              <button className="flex items-center space-x-2 px-5 py-6 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all rounded-lg">
                <span className="text-sm font-medium whitespace-nowrap">{cat.name}</span>
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" />
              </button>

              {/* Mega Menü */}
              {cat.children.length > 0 && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-full bg-white border-t border-gray-100 shadow-xl z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="grid grid-cols-12 gap-8">
                      {/* Alt kategoriler */}
                      <div className={`${cat.featured ? 'col-span-8' : 'col-span-12'} grid gap-6 ${
                        cat.children.length <= 3 ? 'grid-cols-3' :
                        cat.children.length === 4 ? 'grid-cols-4' :
                        cat.children.length <= 6 ? 'grid-cols-6' : 'grid-cols-4'
                      }`}>
                        {cat.children.map((sub) => (
                          <div key={sub.id} className="space-y-3">
                            <div className="flex items-center space-x-2 pb-2 border-b-2 border-blue-200">
                              <Package className="w-4 h-4 text-blue-600" />
                              <h3 className="font-bold text-gray-900 text-sm">{sub.name}</h3>
                            </div>
                            <ul className="space-y-2">
                              {sub.children.map((item) => (
                                <li key={item.id}>
                                  <a
                                    href={`/category/${item.slug}`}
                                    className="text-sm text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all inline-flex items-center space-x-1"
                                  >
                                    <span>→</span>
                                    <span>{item.name}</span>
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      {/* Öne çıkan (featured) alan */}
                      {cat.featured && (
                        <div className="col-span-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-xl p-6">
                          <h3 className="font-bold text-gray-900 text-lg mb-2">{cat.featured.title}</h3>
                          <p className="text-sm text-gray-600 mb-4">{cat.featured.subtitle}</p>
                          {/* Featured öğeler buraya eklenebilir */}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
