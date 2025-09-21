// src/lib/utils.ts

import { Package, Truck, CheckCircle, Clock, X, LucideIcon } from 'lucide-react';

// Order status tipini tanımla
export type OrderStatus = 'processing' | 'shipping' | 'delivered' | 'cancelled';

// Status info interface'i
export interface StatusInfo {
  text: string;
  color: string;
  icon: LucideIcon;
}

/**
 * Fiyatı Türk Lirası formatında gösterir
 * @param price - Fiyat değeri
 * @returns Formatlanmış fiyat string'i (örn: "₺299,90")
 */
export const formatPrice = (price: number): string => {
  return `₺${price.toFixed(2).replace('.', ',')}`;
};

/**
 * Tarihi Türkçe formatında gösterir
 * @param dateString - ISO tarih string'i
 * @returns Formatlanmış tarih (örn: "15 Mart 2024")
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
};

/**
 * Sipariş durumuna göre UI bilgilerini döndürür
 * @param status - Sipariş durumu
 * @returns Status bilgileri (text, color, icon)
 */
export const getStatusInfo = (status: OrderStatus): StatusInfo => {
  const statusMap: Record<OrderStatus, StatusInfo> = {
    processing: { 
      text: 'Hazırlanıyor', 
      color: 'bg-yellow-100 text-yellow-800', 
      icon: Clock 
    },
    shipping: { 
      text: 'Kargoda', 
      color: 'bg-blue-100 text-blue-800', 
      icon: Truck 
    },
    delivered: { 
      text: 'Teslim Edildi', 
      color: 'bg-green-100 text-green-800', 
      icon: CheckCircle 
    },
    cancelled: { 
      text: 'İptal Edildi', 
      color: 'bg-red-100 text-red-800', 
      icon: X 
    }
  };
  
  return statusMap[status] || statusMap.processing;
};

/**
 * Telefon numarasını formatlar (Türkiye formatı)
 * @param phone - Ham telefon numarası
 * @returns Formatlanmış telefon numarası
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{2})(\d{2})$/);
  if (match) {
    return `(${match[1]}) ${match[2]} ${match[3]} ${match[4]}`;
  }
  return phone;
};

/**
 * Sipariş numarasını kısaltır (mobil görünüm için)
 * @param orderId - Tam sipariş ID'si
 * @returns Kısaltılmış ID
 */
export const truncateOrderId = (orderId: string): string => {
  if (orderId.length > 10) {
    return `${orderId.substring(0, 6)}...${orderId.slice(-4)}`;
  }
  return orderId;
};

/**
 * Relative time (kaç saat/gün önce) hesaplar
 * @param dateString - ISO tarih string'i
 * @returns Relative time string'i (örn: "2 gün önce")
 */
export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) {
    return 'Az önce';
  } else if (diffInHours < 24) {
    return `${diffInHours} saat önce`;
  } else if (diffInDays < 7) {
    return `${diffInDays} gün önce`;
  } else {
    return formatDate(dateString);
  }
};

/**
 * CSS class'larını birleştirir (clsx alternatifi)
 * @param classes - CSS class'ları
 * @returns Birleştirilmiş class string'i
 */
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Kargo ücreti hesaplar (basit hesaplama)
 * @param totalAmount - Toplam sipariş tutarı
 * @param address - Teslimat adresi
 * @returns Kargo ücreti
 */
export const calculateShippingCost = (totalAmount: number, address: string): number => {
  // Ücretsiz kargo limiti
  const freeShippingLimit = 150;
  
  if (totalAmount >= freeShippingLimit) {
    return 0;
  }
  
  // İstanbul içi/dışı kontrolü (basit)
  const isIstanbul = address.toLowerCase().includes('istanbul');
  return isIstanbul ? 15 : 25;
};

/**
 * Tahmini teslimat tarihi hesaplar
 * @param orderDate - Sipariş tarihi
 * @param status - Sipariş durumu
 * @returns Tahmini teslimat tarihi
 */
export const getEstimatedDeliveryDate = (orderDate: string, status: OrderStatus): string => {
  const orderDateTime = new Date(orderDate);
  let deliveryDate = new Date(orderDateTime);
  
  switch (status) {
    case 'processing':
      deliveryDate.setDate(orderDateTime.getDate() + 3);
      break;
    case 'shipping':
      deliveryDate.setDate(orderDateTime.getDate() + 1);
      break;
    case 'delivered':
      return 'Teslim edildi';
    case 'cancelled':
      return 'İptal edildi';
    default:
      deliveryDate.setDate(orderDateTime.getDate() + 3);
  }
  
  return formatDate(deliveryDate.toISOString());
};