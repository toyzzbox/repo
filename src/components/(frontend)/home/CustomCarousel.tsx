"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CustomCarouselProps {
  children: React.ReactNode;
  title?: string;
  itemsPerView?: {
    mobile?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  showDots?: boolean;
  showArrows?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
  gap?: string;
}

export function CustomCarousel({
  children,
  title,
  itemsPerView = {
    mobile: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
  },
  showDots = true,
  showArrows = true,
  autoPlay = false,
  autoPlayInterval = 3000,
  className = "",
  gap = "px-3"
}: CustomCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentItemsPerView, setCurrentItemsPerView] = useState(itemsPerView.mobile || 1);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Convert children to array
  const childrenArray = React.Children.toArray(children);
  const totalItems = childrenArray.length;

  // Responsive items per view
  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      if (width >= 1280) setCurrentItemsPerView(itemsPerView.xl || 5);
      else if (width >= 1024) setCurrentItemsPerView(itemsPerView.lg || 4);
      else if (width >= 768) setCurrentItemsPerView(itemsPerView.md || 3);
      else if (width >= 640) setCurrentItemsPerView(itemsPerView.sm || 2);
      else setCurrentItemsPerView(itemsPerView.mobile || 1);
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, [itemsPerView]);

  const maxIndex = Math.max(0, totalItems - currentItemsPerView);

  // Auto play functionality
  useEffect(() => {
    if (autoPlay && totalItems > currentItemsPerView) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      }, autoPlayInterval);

      return () => {
        if (autoPlayRef.current) {
          clearInterval(autoPlayRef.current);
        }
      };
    }
  }, [autoPlay, autoPlayInterval, maxIndex, totalItems, currentItemsPerView]);

  // Navigation functions
  const goToNext = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const goToPrev = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const goToSlide = (index: number) => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    setCurrentIndex(index);
  };

  // Touch/Swipe functionality
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    }
    if (isRightSwipe) {
      goToPrev();
    }
  };

  if (!children || totalItems === 0) {
    return <p className="text-center text-gray-500">İçerik bulunamadı.</p>;
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {showArrows && totalItems > currentItemsPerView && (
            <div className="flex items-center space-x-2">
              <button
                onClick={goToPrev}
                disabled={currentIndex === 0}
                className="p-2 rounded-full border border-gray-300 hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                aria-label="Önceki"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goToNext}
                disabled={currentIndex === maxIndex}
                className="p-2 rounded-full border border-gray-300 hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                aria-label="Sonraki"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Carousel Container */}
      <div className="relative group">
        <div 
          className="overflow-hidden" 
          ref={carouselRef}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / currentItemsPerView)}%)`,
            }}
          >
            {childrenArray.map((child, index) => (
              <div
                key={index}
                className={`flex-shrink-0 ${gap}`}
                style={{ width: `${100 / currentItemsPerView}%` }}
              >
                {child}
              </div>
            ))}
          </div>
        </div>

        {/* Side Navigation Arrows - Hover Style */}
        {showArrows && totalItems > currentItemsPerView && !title && (
          <>
            <button
              onClick={goToPrev}
              disabled={currentIndex === 0}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-gray-50 z-10 disabled:opacity-50"
              aria-label="Önceki"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button
              onClick={goToNext}
              disabled={currentIndex === maxIndex}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-gray-50 z-10 disabled:opacity-50"
              aria-label="Sonraki"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Progress Dots */}
      {showDots && totalItems > currentItemsPerView && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-200 hover:scale-110 ${
                index === currentIndex 
                  ? 'w-6 bg-blue-600' 
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Sayfa ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Product Carousel wrapper specifically for ProductCard
interface ProductCarouselProps {
  products: any[];
  title?: string;
  className?: string;
  productCardComponent: React.ComponentType<{ product: any }>;
}

export function ProductCarousel({ 
  products, 
  title, 
  className,
  productCardComponent: ProductCardComponent
}: ProductCarouselProps) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Ürün bulunamadı.</p>
      </div>
    );
  }

  return (
    <CustomCarousel 
      title={title}
      className={className}
      itemsPerView={{
        mobile: 1,
        sm: 2,
        md: 3,
        lg: 4,
        xl: 5,
      }}
      showDots={true}
      showArrows={true}
      autoPlay={false}
    >
      {products.map((product) => (
        <ProductCardComponent key={product.id} product={product} />
      ))}
    </CustomCarousel>
  );
}