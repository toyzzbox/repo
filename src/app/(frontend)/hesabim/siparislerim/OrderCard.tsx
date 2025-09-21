'use client';

import Link from 'next/link';
import { Package, Truck, CheckCircle, Clock, X, Eye, RotateCcw } from 'lucide-react';
import { formatPrice, formatDate, getStatusInfo } from '@/lib/orders';

export default function OrderCard({ order }) {
  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Sipariş #{order.id}
            </h3>
            <p className="text-gray-600">{formatDate(order.date)}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color} flex items-center gap-1`}>
            <StatusIcon size={16} />
            {statusInfo.text}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Ürün Sayısı</p>
            <p className="font-medium">{order.items.length} ürün</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Toplam Tutar</p>
            <p className="font-medium text-blue-600">{formatPrice(order.total)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Teslimat Adresi</p>
            <p className="font-medium">{order.deliveryAddress}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t">
          <Link
            href={`/orders/${order.id}`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Eye size={16} />
            Detayları Görüntüle
          </Link>
          
          {order.status === 'delivered' && (
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <RotateCcw size={16} />
              Tekrar Sipariş Ver
            </button>
          )}
          
          {order.trackingNumber && (
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Truck size={16} />
              Kargo Takip
            </button>
          )}
        </div>
      </div>
    </div>
  );
}