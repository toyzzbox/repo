import React, { useState } from 'react';
import { ChevronDown, Search, ShoppingCart, User, Heart, Star, Truck, Shield, Headphones } from 'lucide-react';

// TypeScript interface'leri
interface FeaturedItem {
  name: string;
  originalPrice?: string;
  discountPrice: string;
  discount: string;
  image: string;
  rating: number;
  reviews: number;
}

interface Featured {
  title: string;
  subtitle: string;
  items: FeaturedItem[];
}

interface Subcategory {
  title: string;
  items: string[];
}

interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories: Subcategory[];
  featured: Featured;
}

const MegaMenu: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const categories: Category[] = [
    {
      id: 'elektronik',
      name: 'Elektronik & Teknoloji',
      icon: '💻',
      subcategories: [
        {
          title: 'Telefon & Tablet',
          items: ['iPhone 15 Series', 'Samsung Galaxy', 'iPad Pro', 'Android Tablet', 'Telefon Kılıfları', 'Şarj Aletleri', 'Kablosuz Kulaklık']
        },
        {
          title: 'Bilgisayar & Gaming',
          items: ['Gaming Laptop', 'Masaüstü PC', 'Gaming PC', '4K Monitör', 'Mekanik Klavye', 'Gaming Mouse', 'Grafik Kartı']
        },
        {
          title: 'TV & Ses Sistemleri',
          items: ['OLED Smart TV', '8K TV', 'Soundbar', 'Home Theater', 'Bluetooth Hoparlör', 'Studio Kulaklık']
        },
        {
          title: 'Akıllı Ev',
          items: ['Akıllı Aydınlatma', 'Güvenlik Kameraları', 'Akıllı Termostat', 'Ses Asistanları', 'Akıllı Kilit']
        }
      ],
      featured: {
        title: 'Teknoloji Trendleri',
        subtitle: 'Bu hafta en çok satanlar',
        items: [
          { 
            name: 'iPhone 15 Pro Max', 
            originalPrice: '54.999 ₺',
            discountPrice: '49.999 ₺', 
            discount: '%9 İndirim', 
            image: '📱',
            rating: 4.8,
            reviews: 1247
          },
          { 
            name: 'MacBook Air M3', 
            originalPrice: '42.999 ₺',
            discountPrice: '39.999 ₺', 
            discount: 'Ücretsiz Kargo', 
            image: '💻',
            rating: 4.9,
            reviews: 856
          },
          { 
            name: 'AirPods Pro 2', 
            originalPrice: '8.999 ₺',
            discountPrice: '6.999 ₺', 
            discount: '%22 İndirim', 
            image: '🎧',
            rating: 4.7,
            reviews: 2341
          }
        ]
      }
    },
    {
      id: 'moda',
      name: 'Moda & Giyim',
      icon: '👕',
      subcategories: [
        {
          title: 'Kadın Giyim',
          items: ['Sonbahar Elbiseleri', 'Blazer & Ceket', 'Premium Bluz', 'Skinny Jean', 'Kışlık Mont', 'İş Kıyafetleri', 'Gece Kıyafetleri']
        },
        {
          title: 'Erkek Giyim',
          items: ['Takım Elbise', 'Casual Gömlek', 'Chino Pantolon', 'Deri Ayakkabı', 'Kışlık Kaban', 'Spor Ceket', 'Polo Tişört']
        },
        {
          title: 'Ayakkabı & Çanta',
          items: ['Kadın Ayakkabı', 'Erkek Ayakkabı', 'Spor Ayakkabı', 'Deri Çanta', 'Sırt Çantası', 'Cüzdan', 'Kemer']
        },
        {
          title: 'Aksesuarlar',
          items: ['Saat', 'Takı', 'Güneş Gözlüğü', 'Şapka', 'Eldiven', 'Atkı', 'Parfüm']
        }
      ],
      featured: {
        title: 'Sonbahar Koleksiyonu',
        subtitle: '2024 moda trendleri',
        items: [
          { 
            name: 'Sonbahar Trençkot', 
            originalPrice: '1.299 ₺',
            discountPrice: '899 ₺', 
            discount: '%31 İndirim', 
            image: '🧥',
            rating: 4.6,
            reviews: 423
          },
          { 
            name: 'Deri Bot', 
            originalPrice: '899 ₺',
            discountPrice: '699 ₺', 
            discount: '%22 İndirim', 
            image: '👢',
            rating: 4.5,
            reviews: 687
          },
          { 
            name: 'Crossbody Çanta', 
            originalPrice: '649 ₺',
            discountPrice: '449 ₺', 
            discount: '%31 İndirim', 
            image: '👜',
            rating: 4.8,
            reviews: 234
          }
        ]
      }
    },
    {
      id: 'ev',
      name: 'Ev & Dekorasyon',
      icon: '🏠',
      subcategories: [
        {
          title: 'Mobilya',
          items: ['Modern Koltuk Takımı', 'Yatak Odası Takımı', 'Mutfak Dolabı', 'Çalışma Masası', 'Gardırop', 'TV Ünitesi', 'Yemek Masası']
        },
        {
          title: 'Dekorasyon',
          items: ['LED Aydınlatma', 'Duvar Saati', 'Tablo & Poster', 'Vazo & Heykel', 'Ayna', 'Mumluk', 'Bitki & Saksı']
        },
        {
          title: 'Ev Tekstili',
          items: ['Nevresim Takımı', 'Kaliteli Havlu', 'Yastık & Kılıf', 'Perde', 'Halı', 'Örtü', 'Battaniye']
        },
        {
          title: 'Mutfak & Banyo',
          items: ['Ankastre Set', 'Kahve Makinesi', 'Blender Set', 'Tencere Takımı', 'Banyo Aksesuarları', 'Havluluk']
        }
      ],
      featured: {
        title: 'Ev Yenileme',
        subtitle: 'Kış hazırlığı ürünleri',
        items: [
          { 
            name: 'Modern Koltuk Takımı', 
            originalPrice: '12.999 ₺',
            discountPrice: '9.999 ₺', 
            discount: '12 Taksit', 
            image: '🛋️',
            rating: 4.7,
            reviews: 156
          },
          { 
            name: 'Akıllı Aydınlatma', 
            originalPrice: '2.299 ₺',
            discountPrice: '1.599 ₺', 
            discount: '%30 İndirim', 
            image: '💡',
            rating: 4.6,
            reviews: 234
          },
          { 
            name: 'Kışlık Battaniye', 
            originalPrice: '599 ₺',
            discountPrice: '399 ₺', 
            discount: '%33 İndirim', 
            image: '🛏️',
            rating: 4.9,
            reviews: 445
          }
        ]
      }
    },
    {
      id: 'spor',
      name: 'Spor & Outdoor',
      icon: '⚽',
      subcategories: [
        {
          title: 'Fitness & Gym',
          items: ['Koşu Bandı', 'Dumbell Set', 'Yoga Matı', 'Protein Tozu', 'Fitness Saati', 'Spor Kıyafetleri']
        },
        {
          title: 'Outdoor',
          items: ['Kamp Çadırı', 'Trekking Ayakkabı', 'Sırt Çantası', 'Sleeping Bag', 'Outdoor Kıyafet', 'GPS Cihaz']
        },
        {
          title: 'Su Sporları',
          items: ['Yüzme Gözlüğü', 'Mayo & Bikini', 'Sörf Tahtası', 'Şnorkel Set', 'Su Geçirmez Çanta']
        },
        {
          title: 'Takım Sporları',
          items: ['Futbol Topu', 'Basketbol', 'Tenis Raketi', 'Voleybol', 'Badminton Set', 'Masa Tenisi']
        }
      ],
      featured: {
        title: 'Kış Sporları',
        subtitle: 'Sezon açılışı',
        items: [
          { 
            name: 'Snowboard Set', 
            originalPrice: '4.999 ₺',
            discountPrice: '3.999 ₺', 
            discount: '%20 İndirim', 
            image: '🏂',
            rating: 4.8,
            reviews: 89
          },
          { 
            name: 'Kış Montu', 
            originalPrice: '1.899 ₺',
            discountPrice: '1.399 ₺', 
            discount: '%26 İndirim', 
            image: '🧥',
            rating: 4.7,
            reviews: 167
          }
        ]
      }
    }
  ];

  return (
    <nav className="bg-white border-t border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center space-x-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className="relative"
              onMouseEnter={() => setActiveMenu(category.id)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button className="flex items-center space-x-2 px-6 py-4 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 rounded-lg group">
                <span className="text-xl">{category.icon}</span>
                <span className="font-medium">{category.name}</span>
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" />
              </button>
            </div>
          ))}
          <div className="flex-1" />
          <button className="px-6 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg">
            🔥 SÜPER KAMPANYA
          </button>
        </div>
      </div>

      {/* Desktop Mega Menu */}
      {activeMenu && (
        <div
          className="absolute top-full left-0 w-full bg-white shadow-2xl border-t z-50"
          onMouseEnter={() => setActiveMenu(activeMenu)}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <div className="max-w-7xl mx-auto px-6 py-12">
            {categories
              .filter(cat => cat.id === activeMenu)
              .map((category) => (
                <div key={category.id} className="grid grid-cols-12 gap-12">
                  {/* Categories Grid - 8 columns */}
                  <div className="col-span-8 grid grid-cols-4 gap-8">
                    {category.subcategories.map((subcat, index) => (
                      <div key={index} className="space-y-4">
                        <h3 className="font-bold text-gray-900 text-lg border-b-2 border-blue-200 pb-3 mb-4">
                          {subcat.title}
                        </h3>
                        <ul className="space-y-3">
                          {subcat.items.map((item, itemIndex) => (
                            <li key={itemIndex}>
                              <button className="text-gray-600 hover:text-blue-600 transition-colors text-left hover:font-medium block w-full">
                                {item}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Featured Section - 4 columns */}
                  <div className="col-span-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-8">
                    <h3 className="font-bold text-gray-900 text-2xl mb-2">
                      {category.featured.title}
                    </h3>
                    <p className="text-gray-600 mb-6">{category.featured.subtitle}</p>
                    
                    <div className="space-y-4">
                      {category.featured.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer group">
                          <div className="text-3xl group-hover:scale-110 transition-transform duration-200">
                            {item.image}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 mb-1">{item.name}</div>
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">{item.rating}</span>
                              </div>
                              <span className="text-xs text-gray-500">({item.reviews} değerlendirme)</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {item.originalPrice && (
                                <span className="text-sm text-gray-400 line-through">{item.originalPrice}</span>
                              )}
                              <span className="font-bold text-blue-600">{item.discountPrice}</span>
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                                {item.discount}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold text-lg shadow-lg">
                      Tüm Ürünleri Keşfet
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default MegaMenu;