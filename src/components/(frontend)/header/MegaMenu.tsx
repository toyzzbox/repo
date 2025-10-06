'use client';
import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { getCategories } from '@/actions/categoryMenu';

interface Category {
  id: string;
  name: string;
  slug: string;
  children: Category[];
}

const MegaMenu: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    // Server action çağır
    async function fetchCategories() {
      const data = await getCategories();
      setCategories(data);
    }
    fetchCategories();
  }, []);

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 flex items-center space-x-2">
        {categories.map(cat => (
          <div
            key={cat.id}
            className="relative"
            onMouseEnter={() => setActiveMenu(cat.id)}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <button className="flex items-center space-x-2 px-6 py-4 hover:bg-blue-50 hover:text-orange-600 transition-all duration-200 rounded-lg group">
              <span className="text-sm font-medium whitespace-nowrap">{cat.name}</span>
              <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" />
            </button>

            {activeMenu === cat.id && cat.children.length > 0 && (
              <div className="absolute top-full left-0 w-64 bg-white shadow-lg border-t p-4">
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
};

export default MegaMenu;
