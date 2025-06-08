// components/AddressSection.tsx

import { AddressSectionProps } from "../types";

export default function AddressSection({ data, onChange, errors }: AddressSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Teslimat Adresi</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Ad Soyad</label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
            className={`w-full p-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Ad Soyadınız"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Telefon</label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => onChange({ ...data, phone: e.target.value })}
            className={`w-full p-2 border rounded-md ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="0555 123 45 67"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Adres</label>
        <textarea
          value={data.address}
          onChange={(e) => onChange({ ...data, address: e.target.value })}
          className={`w-full p-2 border rounded-md ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Mahalle, sokak, bina no, daire no"
          rows={3}
        />
        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Şehir</label>
        <select
          value={data.city}
          onChange={(e) => onChange({ ...data, city: e.target.value })}
          className={`w-full p-2 border rounded-md ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
        >
          <option value="">Şehir seçiniz</option>
          <option value="istanbul">İstanbul</option>
          <option value="ankara">Ankara</option>
          <option value="izmir">İzmir</option>
          <option value="bursa">Bursa</option>
          <option value="antalya">Antalya</option>
          <option value="adana">Adana</option>
          <option value="konya">Konya</option>
          <option value="trabzon">Trabzon</option>
        </select>
        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
      </div>
    </div>
  );
}