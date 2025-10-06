// src/components/MegaMenuServer.tsx
import { prisma } from '@/lib/prisma';
import { ChevronDown, Star } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  children: Category[];
}

export default async function MegaMenuServer() {
  const categories: Category[] = await prisma.category.findMany({
    where: { parentId: null },
    include: { children: { include: { children: true } } },
    orderBy: { order: 'asc' },
  });

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 flex items-center space-x-2">
        {categories.map(cat => (
          <div key={cat.id} className="relative group">
            <button className="flex items-center space-x-2 px-6 py-4 hover:bg-blue-50 hover:text-orange-600 transition-all duration-200 rounded-lg">
              <span className="text-sm font-medium whitespace-nowrap">{cat.name}</span>
              <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" />
            </button>

            {cat.children.length > 0 && (
              <div className="absolute top-full left-0 w-64 bg-white shadow-lg border-t p-4 hidden group-hover:block">
                {cat.children.map(sub => (
                  <div key={sub.id} className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{sub.name}</h3>
                    <ul className="space-y-1">
                      {sub.children.map(item => (
                        <li key={item.id}>
                          <a href={`/category/${item.slug}`} className="text-gray-600 hover:text-blue-600 block">
                            {item.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
