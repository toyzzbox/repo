// components/DeliverySection.tsx
import { DeliverySectionProps } from "../types";

export default function DeliverySection({ data, onChange }: DeliverySectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Kargo Bilgileri</h2>
      
      <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">Standart Kargo</h3>
            <p className="text-sm text-gray-600">1-2 iş günü içinde teslim</p>
          </div>
          <span className="font-semibold text-lg">Ücretsiz</span>
        </div>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <label className="block text-sm font-medium mb-2">Tercih Edilen Teslimat Tarihi</label>
        <input
          type="date"
          value={data.date}
          onChange={(e) => onChange({ ...data, method: 'standard', date: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md"
          min={new Date().toISOString().split('T')[0]}
        />
        <p className="text-xs text-gray-500 mt-2">
          * Kargo şirketinin durumuna göre değişiklik gösterebilir
        </p>
      </div>
    </div>
  );
}