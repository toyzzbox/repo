'use client';

import { Dispatch, SetStateAction } from 'react';

// Order tipini tanımlayın
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

// Tab tipini tanımlayın
interface Tab {
  key: string;
  label: string;
}

// Component props tipini tanımlayın
interface OrdersFilterProps {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  orders: Order[];
}

export default function OrdersFilter({ activeTab, setActiveTab, orders }: OrdersFilterProps) {
  const getOrderCount = (status: string): number => {
    if (status === 'all') return orders.length;
    return orders.filter(order => order.status === status).length;
  };

  const tabs: Tab[] = [
    { key: 'all', label: 'Tüm Siparişler' },
    { key: 'processing', label: 'Hazırlanıyor' },
    { key: 'shipping', label: 'Kargoda' },
    { key: 'delivered', label: 'Teslim Edildi' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm mb-6">
      <div className="flex border-b overflow-x-auto">
        {tabs.map((tab: Tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-6 py-3 font-medium whitespace-nowrap ${
              activeTab === tab.key
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label} ({getOrderCount(tab.key)})
          </button>
        ))}
      </div>
    </div>
  );
}