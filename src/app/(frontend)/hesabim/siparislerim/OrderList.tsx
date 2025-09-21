'use client';

import { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import OrdersFilter from './OrdersFilter';
import OrderCard from './OrderCard';

// Order tiplerini tanımla
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  status: 'processing' | 'shipping' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
  trackingNumber?: string;
  deliveryAddress: string;
}

// Örnek siparişler data'sı
const mockOrders: Order[] = [
  {
    id: "SP2024001",
    date: "2024-03-15",
    status: "delivered",
    total: 299.90,
    items: [
      { name: "iPhone 15 Kılıfı", quantity: 1, price: 99.90, image: "📱" },
      { name: "Wireless Kulaklık", quantity: 1, price: 200.00, image: "🎧" }
    ],
    trackingNumber: "TK123456789",
    deliveryAddress: "Kadıköy, İstanbul"
  },
  {
    id: "SP2024002", 
    date: "2024-03-10",
    status: "shipping",
    total: 459.50,
    items: [
      { name: "Bluetooth Hoparlör", quantity: 2, price: 179.75, image: "🔊" },
      { name: "USB-C Kablo", quantity: 1, price: 99.00, image: "🔌" }
    ],
    trackingNumber: "TK987654321",
    deliveryAddress: "Beşiktaş, İstanbul"
  },
  {
    id: "SP2024003",
    date: "2024-03-08", 
    status: "processing",
    total: 150.00,
    items: [
      { name: "Laptop Standı", quantity: 1, price: 150.00, image: "💻" }
    ],
    trackingNumber: undefined,
    deliveryAddress: "Şişli, İstanbul"
  },
  {
    id: "SP2024004",
    date: "2024-02-28",
    status: "cancelled",
    total: 75.00,
    items: [
      { name: "Mouse Pad", quantity: 1, price: 75.00, image: "🖱️" }
    ],
    trackingNumber: undefined,
    deliveryAddress: "Üsküdar, İstanbul"
  },
  {
    id: "SP2024005",
    date: "2024-03-20",
    status: "delivered",
    total: 599.00,
    items: [
      { name: "Mechanical Klavye", quantity: 1, price: 399.00, image: "⌨️" },
      { name: "Gaming Mouse", quantity: 1, price: 200.00, image: "🖱️" }
    ],
    trackingNumber: "TK555666777",
    deliveryAddress: "Maltepe, İstanbul"
  },
  {
    id: "SP2024006",
    date: "2024-03-18",
    status: "shipping",
    total: 1250.00,
    items: [
      { name: "Tablet", quantity: 1, price: 1200.00, image: "📱" },
      { name: "Tablet Kılıfı", quantity: 1, price: 50.00, image: "🛡️" }
    ],
    trackingNumber: "TK888999000",
    deliveryAddress: "Bakırköy, İstanbul"
  }
];

// Mock API fonksiyonu
const fetchOrdersFromAPI = async (): Promise<Order[]> => {
  // API çağrısını simüle et
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // %5 ihtimalle hata simüle et
      if (Math.random() < 0.05) {
        reject(new Error('Sunucu bağlantı hatası'));
        return;
      }
      resolve(mockOrders);
    }, 1000); // 1 saniye loading simüle et
  });
};

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
    const fetchOrders = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        
        // Gerçek API çağrısı:
        // const response = await fetch('/api/orders');
        // const data = await response.json();
        
        // Mock data kullan:
        const data = await fetchOrdersFromAPI();
        setOrders(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata oluştu';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filterOrders = (status: string): Order[] => {
    if (status === 'all') return orders;
    return orders.filter(order => order.status === status);
  };

  const filteredOrders = filterOrders(activeTab);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6">
            <div className="h-6 bg-gray-300 rounded w-32 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Siparişler yüklenirken hata oluştu: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  return (
    <>
      <OrdersFilter
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        orders={orders}
      />

      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz sipariş yok</h3>
            <p className="text-gray-600">Bu kategoride henüz bir siparişiniz bulunmuyor.</p>
          </div>
        ) : (
          filteredOrders.map((order: Order) => (
            <OrderCard key={order.id} order={order} />
          ))
        )}
      </div>
    </>
  );
}