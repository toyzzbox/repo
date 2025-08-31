"use client"

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
  subcategories: Subcategory[];
  featured: Featured;
}

const MegaMenu: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const categories: Category[] = [
    {
      id: 'oyuncak',
      name: 'Oyuncaklar',
      subcategories: [
        {
          title: 'Oyuncak Bebek ve Aksesuarları',
          items: ['Bez Bebekler', 'Manken Bebekler', 'Fonksiyonlu Et Bebekler', 'Bebek Aksesuarları', 'Bebek Arabası']
        },
        {
          title: 'Oyuncak Arabalar',
          items: ['Uzaktan Kumandalı Arabalar', 'Model Koleksiyon Arabalar', 'Yarış Pistleri', 'Mini Arabalar', 'Kamyon Setleri']
        },
        {
          title: 'Peluş Oyuncaklar',
          items: ['Lisanslı Peluşlar', 'Hareketli Peluş Oyuncaklar', 'Peluş Ayı ve Pandalar', 'Peluş Kedi ve Köpekler', 'Diğer Peluşlar']
        },
        {
          title: 'Oyuncak Silahlar',
          items: ['Silah Setleri', 'Yumuşak Nerf Mermili Silahlar', 'Su Tabancaları', 'Lazer Tabancaları']
        },
        {
          title: 'Kutu Oyunları',
          items: ['Çocuk Kutu Oyunları', 'Yetişkin Kutu Oyunları', 'Eğitici Oyunlar', 'Strateji Oyunları']
        }
      ],
      featured: {
        title: 'Popüler Oyuncaklar',
        subtitle: 'Çocukların favorileri',
        items: [
          {
            name: 'RC Araba Seti',
            originalPrice: '899 ₺',
            discountPrice: '699 ₺',
            discount: '%22 İndirim',
            image: '🚗',
            rating: 4.7,
            reviews: 342
          },
          {
            name: 'Peluş Ayı',
            originalPrice: '299 ₺',
            discountPrice: '199 ₺',
            discount: '%33 İndirim',
            image: '🧸',
            rating: 4.9,
            reviews: 567
          },
          {
            name: 'Lego Set',
            originalPrice: '1.299 ₺',
            discountPrice: '999 ₺',
            discount: '%23 İndirim',
            image: '🔧',
            rating: 4.8,
            reviews: 234
          }
        ]
      }
    },
    {
      id: 'anne-bebek',
      name: 'Anne & Bebek',
      subcategories: [
        {
          title: 'Bebek Bakım',
          items: ['Bebek Bezi', 'Bebek Maması', 'Biberon ve Emzik', 'Bebek Şampuanı', 'Bebek Kremi', 'Islak Mendil']
        },
        {
          title: 'Bebek Giyim',
          items: ['Bebek Tulum', 'Bebek Body', 'Bebek Ayakkabı', 'Bebek Şapka', 'Bebek Eldiven', 'Bebek Çorap']
        },
        {
          title: 'Anne Bakım',
          items: ['Hamile Giyim', 'Emzirme Sütyeni', 'Anne Vitamin', 'Cilt Bakım', 'Saç Bakım']
        },
        {
          title: 'Bebek Mobilyası',
          items: ['Bebek Beşiği', 'Bebek Odası Takımı', 'Mama Sandalyesi', 'Oyun Parkı', 'Bebek Dolabı']
        }
      ],
      featured: {
        title: 'Anne-Bebek Essentials',
        subtitle: 'İhtiyacınız olan her şey',
        items: [
          {
            name: 'Bebek Bakım Seti',
            originalPrice: '599 ₺',
            discountPrice: '399 ₺',
            discount: '%33 İndirim',
            image: '🍼',
            rating: 4.8,
            reviews: 456
          },
          {
            name: 'Bebek Arabası',
            originalPrice: '2.999 ₺',
            discountPrice: '1.999 ₺',
            discount: '%33 İndirim',
            image: '🚼',
            rating: 4.6,
            reviews: 234
          },
          {
            name: 'Anne Bakım Paketi',
            originalPrice: '899 ₺',
            discountPrice: '649 ₺',
            discount: '%28 İndirim',
            image: '💆‍♀️',
            rating: 4.7,
            reviews: 189
          }
        ]
      }
    },
    {
      id: 'okul-kirtasiye',
      name: 'Okul & Kırtasiye',
      subcategories: [
        {
          title: 'Okul Malzemeleri',
          items: ['Okul Çantası', 'Kalem Kutusu', 'Defterler', 'Kalemler', 'Silgiler', 'Cetvel Seti']
        },
        {
          title: 'Kırtasiye Ürünleri',
          items: ['Dosyalama', 'Zımba ve Delgeç', 'Yapıştırıcılar', 'Büro Malzemeleri', 'Hesap Makinesi']
        },
        {
          title: 'Sanat Malzemeleri',
          items: ['Boyama Setleri', 'Resim Kağıdı', 'Fırça Setleri', 'Pastel Boyalar', 'Keçeli Kalemler']
        },
        {
          title: 'Eğitim Kitapları',
          items: ['Test Kitapları', 'Ders Kitapları', 'Hikaye Kitapları', 'Aktivite Kitapları', 'Sözlükler']
        }
      ],
      featured: {
        title: 'Okula Dönüş',
        subtitle: 'Yeni dönem hazırlıkları',
        items: [
          {
            name: 'Okul Çantası Seti',
            originalPrice: '499 ₺',
            discountPrice: '299 ₺',
            discount: '%40 İndirim',
            image: '🎒',
            rating: 4.5,
            reviews: 678
          },
          {
            name: 'Kırtasiye Paketi',
            originalPrice: '199 ₺',
            discountPrice: '129 ₺',
            discount: '%35 İndirim',
            image: '✏️',
            rating: 4.7,
            reviews: 345
          },
          {
            name: 'Boyama Seti',
            originalPrice: '299 ₺',
            discountPrice: '199 ₺',
            discount: '%33 İndirim',
            image: '🎨',
            rating: 4.8,
            reviews: 234
          }
        ]
      }
    },
    {
      id: 'spor',
      name: 'Spor & Outdoor',
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
    },
    {
      id: 'elektronik',
      name: 'Elektronik',
      subcategories: [
        {
          title: 'Telefon & Tablet',
          items: ['Akıllı Telefon', 'Tablet', 'Telefon Kılıfı', 'Şarj Aleti', 'Kulaklık', 'Power Bank']
        },
        {
          title: 'Bilgisayar',
          items: ['Laptop', 'Masaüstü PC', 'Monitör', 'Klavye', 'Mouse', 'Yazıcı']
        },
        {
          title: 'TV & Ses',
          items: ['Smart TV', 'Soundbar', 'Hoparlör', 'Kulaklık', 'Mikrofon', 'Ses Sistemi']
        },
        {
          title: 'Fotoğraf',
          items: ['Dijital Fotoğraf Makinesi', 'Objektif', 'Tripod', 'Flaş', 'Hafıza Kartı', 'Kamera Çantası']
        }
      ],
      featured: {
        title: 'Teknoloji Trendleri',
        subtitle: 'En yeni teknolojiler',
        items: [
          {
            name: 'Akıllı Telefon',
            originalPrice: '15.999 ₺',
            discountPrice: '12.999 ₺',
            discount: '%19 İndirim',
            image: '📱',
            rating: 4.6,
            reviews: 1234
          },
          {
            name: 'Laptop',
            originalPrice: '25.999 ₺',
            discountPrice: '22.999 ₺',
            discount: '%12 İndirim',
            image: '💻',
            rating: 4.8,
            reviews: 567
          }
        ]
      }
    },
    {
      id: 'hediyelik',
      name: 'Hediyelik Eşya',
      subcategories: [
        {
          title: 'Kişisel Hediyeler',
          items: ['Kişiselleştirilebilir Ürünler', 'İsme Özel Hediyeler', 'Fotoğraflı Hediyeler', 'El Yapımı Ürünler']
        },
        {
          title: 'Özel Gün Hediyeleri',
          items: ['Doğum Günü Hediyeleri', 'Yıldönümü Hediyeleri', 'Mezuniyet Hediyeleri', 'Sevgililer Günü']
        },
        {
          title: 'Ev Dekorasyonu',
          items: ['Dekoratif Objeler', 'Mum & Mumluk', 'Çerçeve & Tablo', 'Süs Bitkileri']
        },
        {
          title: 'Lüks Hediyeler',
          items: ['Mücevher & Takı', 'Parfüm & Kozmetik', 'İthal Çikolata', 'Özel Koleksiyonlar']
        }
      ],
      featured: {
        title: 'Özel Hediye Koleksiyonu',
        subtitle: 'Sevdikleriniz için özel seçimler',
        items: [
          {
            name: 'Kişiye Özel Fotoğraf Albümü',
            originalPrice: '299 ₺',
            discountPrice: '199 ₺',
            discount: '%33 İndirim',
            image: '📸',
            rating: 4.9,
            reviews: 456
          },
          {
            name: 'Premium Çikolata Seti',
            originalPrice: '199 ₺',
            discountPrice: '149 ₺',
            discount: '%25 İndirim',
            image: '🍫',
            rating: 4.8,
            reviews: 234
          }
        ]
      }
    }
  ];

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center space-x-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className="relative"
              onMouseEnter={() => setActiveMenu(category.id)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button className="flex items-center space-x-2 px-6 py-4 hover:bg-blue-50 hover:text-orange-600 transition-all duration-200 rounded-lg group">
                <span className="font-medium">{category.name}</span>
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" />
              </button>
            </div>
          ))}
          <div className="flex-1" />
          <button className="px-6 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg">
            Fırsatlar
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
                        <h3 className="font-bold text-gray-900 border-b-2 border-blue-200 pb-3 mb-4">
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