'use client';

import { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import OrdersFilter from './OrdersFilter';
import OrderCard from './OrderCard';
import { getUserOrders } from '@/actions/getUserOrders';

interface Order {
  id: string;
  createdAt: string;
  status: 'processing' | 'shipping' | 'delivered' | 'cancelled';
  total: number;
  items: {
    product: { name: string; image: string };
    quantity: number;
    price: number;
  }[];
  deliveryAddress: string;
}

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getUserOrders(); // Server Action çağrısı
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bilinmeyen hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter(order => order.status === activeTab);

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p>Hata: {error}</p>;

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
          filteredOrders.map(order => <OrderCard key={order.id} order={order} />)
        )}
      </div>
    </>
  );
}
