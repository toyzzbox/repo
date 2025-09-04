import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Heart, ShoppingCart } from 'lucide-react';

const ProductCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  // 12 örnek ürün verisi
  const products = [
    {
      id: 1,
      name: "Premium Kablosuz Kulaklık",
      price: "₺1,299",
      originalPrice: "₺1,599",
      rating: 4.8,
      reviews: 124,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
      badge: "Popüler"
    },
    {
      id: 2,
      name: "Akıllı Saat Series 8",
      price: "₺2,499",
      originalPrice: null,
      rating: 4.9,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
      badge: "Yeni"
    },
    {
      id: 3,
      name: "Minimalist Çanta",
      price: "₺849",
      originalPrice: "₺1,199",
      rating: 4.6,
      reviews: 203,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
      badge: "İndirim"
    },
    {
      id: 4,
      name: "Gaming Mekanik Klavye",
      price: "₺1,899",
      originalPrice: null,
      rating: 4.7,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=300&fit=crop",
      badge: null
    },
    {
      id: 5,
      name: "Vintage Polaroid Kamera",
      price: "₺899",
      originalPrice: "₺1,099",
      rating: 4.5,
      reviews: 78,
      image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&h=300&fit=crop",
      badge: "Retro"
    },
    {
      id: 6,
      name: "Ergonomik Ofis Sandalyesi",
      price: "₺3,299",
      originalPrice: null,
      rating: 4.8,
      reviews: 92,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop",
      badge: "Premium"
    },
    {
      id: 7,
      name: "Bluetooth Hoparlör",
      price: "₺599",
      originalPrice: "₺799",
      rating: 4.4,
      reviews: 167,
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop",
      badge: "Bestseller"
    },
    {
      id: 8,
      name: "Çelik Termos",
      price: "₺299",
      originalPrice: null,
      rating: 4.6,
      reviews: 234,
      image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&h=300&fit=crop",
      badge: null
    },
    {
      id: 9,
      name: "LED Masa Lambası",
      price: "₺449",
      originalPrice: "₺599",
      rating: 4.3,
      reviews: 145,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
      badge: "Eco"
    },
    {
      id: 10,
      name: "Deri Cüzdan",
      price: "₺399",
      originalPrice: null,
      rating: 4.7,
      reviews: 188,
      image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&h=300&fit=crop",
      badge: "Handmade"
    },
    {
      id: 11,
      name: "Spor Ayakkabı",
      price: "₺1,199",
      originalPrice: "₺1,499",
      rating: 4.5,
      reviews: 312,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
      badge: "Sport"
    },
    {
      id: 12,
      name: "Kahve Makinesi",
      price: "₺2,199",
      originalPrice: null,
      rating: 4.9,
      reviews: 67,
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop",
      badge: "Premium"
    }
  ];

  // Responsive items per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 768) {
        setItemsPerView(2);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, products.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex(prev => prev >= maxIndex ? 0 : prev + 1);
  };

  const prevSlide = () => {
    setCurrentIndex(prev => prev <= 0 ? maxIndex : prev - 1);
  };

  const goToSlide = (index) => {
    setCurrentIndex(Math.min(index, maxIndex));
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-white">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Öne Çıkan Ürünler</h2>
        <p className="text-gray-600">En popüler ve kaliteli ürünlerimizi keşfedin</p>
      </div>

      <div className="relative">
        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 border hover:scale-110"
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 border hover:scale-110"
          disabled={currentIndex >= maxIndex}
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>

        {/* Products Container */}
        <div className="overflow-hidden rounded-2xl">
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 px-3"
                style={{ width: `${100 / itemsPerView}%` }}
              >
                <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Badge */}
                    {product.badge && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        {product.badge}
                      </div>
                    )}

                    {/* Wishlist Button */}
                    <button className="absolute top-3 right-3 bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50">
                      <Heart className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" />
                    </button>

                    {/* Quick Actions */}
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm">
                        <ShoppingCart className="w-4 h-4" />
                        Sepete Ekle
                      </button>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 h-12">
                      {product.name}
                    </h3>
                    
                    {/* Rating */}
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-gray-900">
                          {product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            {product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-6 gap-2">
          {[...Array(maxIndex + 1)].map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                currentIndex === index
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-110'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Product Counter */}
        <div className="text-center mt-4 text-sm text-gray-600">
          {Math.min((currentIndex + 1) * itemsPerView, products.length)} / {products.length} ürün gösteriliyor
        </div>
      </div>
    </div>
  );
};

export default ProductCarousel;