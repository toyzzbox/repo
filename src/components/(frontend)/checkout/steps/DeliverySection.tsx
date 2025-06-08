// components/DeliverySection.tsx

import { DeliverySectionProps } from "../types";

export default function DeliverySection({ data, onChange }: DeliverySectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Kargo Seçenekleri</h2>
      <div className="space-y-3">
        <div 
          className={`p-4 border rounded-lg cursor-pointer transition-all ${
            data.method === 'standard' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onChange({ ...data, method: 'standard' })}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input 
                type="radio" 
                checked={data.method === 'standard'} 
                onChange={() => {}} 
                className="mr-3"
                tabIndex={-1}
              />
              <div>
                <h3 className="font-medium">Standart Kargo</h3>
                <p className="text-sm text-gray-600">3-5 iş günü</p>
              </div>
            </div>
            <span className="font-semibold">₺19.90</span>
          </div>
        </div>
        
        <div 
          className={`p-4 border rounded-lg cursor-pointer transition-all ${
            data.method === 'express' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onChange({ ...data, method: 'express' })}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input 
                type="radio" 
                checked={data.method === 'express'} 
                onChange={() => {}} 
                className="mr-3"
                tabIndex={-1}
              />
              <div>
                <h3 className="font-medium">Hızlı Kargo</h3>
                <p className="text-sm text-gray-600">1-2 iş günü</p>
              </div>
            </div>
            <span className="font-semibold">₺39.90</span>
          </div>
        </div>

        <div 
          className={`p-4 border rounded-lg cursor-pointer transition-all ${
            data.method === 'same-day' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onChange({ ...data, method: 'same-day' })}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input 
                type="radio" 
                checked={data.method === 'same-day'} 
                onChange={() => {}} 
                className="mr-3"
                tabIndex={-1}
              />
              <div>
                <h3 className="font-medium">Aynı Gün Teslimat</h3>
                <p className="text-sm text-gray-600">Saat 16:00'ya kadar olan siparişler</p>
              </div>
            </div>
            <span className="font-semibold">₺59.90</span>
          </div>
        </div>
      </div>
      
      {data.method && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <label className="block text-sm font-medium mb-1">Tercih Edilen Teslimat Tarihi</label>
          <input
            type="date"
            value={data.date}
            onChange={(e) => onChange({ ...data, date: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
            min={new Date().toISOString().split('T')[0]}
          />
          <p className="text-xs text-gray-500 mt-1">
            * Kargo şirketinin durumuna göre değişiklik gösterebilir
          </p>
        </div>
      )}
    </div>
  );
}