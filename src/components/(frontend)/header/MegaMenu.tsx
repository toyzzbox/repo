
import { prisma } from '@/lib/prisma';
import { ChevronDown, Star } from 'lucide-react';

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
    <nav className="bg-white sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center space-x-2">
          {categories.map((cat) => (
            <div key={cat.id} className="group">
              {/* Ana kategori butonu */}
              <button className="flex items-center space-x-2 px-6 py-4 hover:bg-blue-50 hover:text-orange-600 transition-all duration-200 rounded-lg">
                <span className="text-sm font-medium whitespace-nowrap">{cat.name}</span>
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" />
              </button>

              {/* Tam genişlikte açılan mega menü */}
              {cat.children.length > 0 && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-screen bg-white shadow-2xl border-t z-50 hidden group-hover:block animate-fade-in">
                  <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-12 gap-12">
                    {/* Alt kategoriler */}
                    <div className="col-span-12 grid grid-cols-4 gap-8">
                      {cat.children.map((sub) => (
                        <div key={sub.id} className="space-y-4">
                          <h3 className="font-bold text-gray-900 border-b-2 border-blue-200 pb-3 mb-4">
                            {sub.name}
                          </h3>
                          <ul className="space-y-3">
                            {sub.children.map((item) => (
                              <li key={item.id}>
                                
                                  href={`/category/${item.slug}`}
                                  className="text-gray-600 hover:text-blue-600 block hover:font-medium transition-colors"
                                >
                                  {item.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
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