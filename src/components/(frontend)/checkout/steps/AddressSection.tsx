"use client";

import { useState } from "react";

type AddressData = {
  id?: string;
  name: string;
  phone: string;
  address: string;
  addressLine2?: string;
  city: string;
  district: string;
  neighborhood: string;
  postalCode: string;
};

type SavedAddress = {
  id: string;
  title: string;
  name: string;
  phone: string;
  address: string;
  addressLine2?: string;
  city: string;
  district: string;
  neighborhood: string;
  postalCode: string;
  isDefault?: boolean;
};

type AddressSelectorProps = {
  data: AddressData;
  onChange: (data: AddressData) => void;
  errors?: Record<string, string>;
  savedAddresses?: SavedAddress[];
  onSaveAddress?: (address: AddressData & { title: string; isDefault: boolean }) => void;
};

export default function AddressSelector({
  data,
  onChange,
  errors = {},
  savedAddresses = [],
  onSaveAddress,
}: AddressSelectorProps) {
  const [showModal, setShowModal] = useState(false);
  const [newAddress, setNewAddress] = useState<AddressData & { title: string; isDefault: boolean }>({
    title: "",
    name: "",
    phone: "",
    address: "",
    addressLine2: "",
    city: "",
    district: "",
    neighborhood: "",
    postalCode: "",
    isDefault: false,
  });
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    data.id || (savedAddresses.find(a => a.isDefault)?.id || null)
  );

  const handleSelectAddress = (address: SavedAddress) => {
    setSelectedAddressId(address.id);
    onChange({
      id: address.id,
      name: address.name,
      phone: address.phone,
      address: address.address,
      addressLine2: address.addressLine2,
      city: address.city,
      district: address.district,
      neighborhood: address.neighborhood,
      postalCode: address.postalCode,
    });
  };

  const handleOpenModal = () => {
    setNewAddress({
      title: "",
      name: "",
      phone: "",
      address: "",
      addressLine2: "",
      city: "",
      district: "",
      neighborhood: "",
      postalCode: "",
      isDefault: false,
    });
    setShowModal(true);
  };

  const handleSaveNewAddress = () => {
    if (onSaveAddress) {
      onSaveAddress(newAddress);
    }
    setShowModal(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg border p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            Fatura ve Teslimat Adresi
          </h2>
          <button
            onClick={handleOpenModal}
            className="flex items-center gap-1 text-sm font-medium hover:underline"
          >
            Yeni Adres Ekle
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* Kayıtlı Adresler */}
        {savedAddresses.length > 0 ? (
          <div className="space-y-3">
            {savedAddresses.map((address) => {
              const isSelected = selectedAddressId === address.id;
              
              return (
                <button
                  key={address.id}
                  onClick={() => handleSelectAddress(address)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all relative ${
                    isSelected
                      ? "border-black bg-white"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="absolute top-4 right-4">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? "border-black bg-black"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>

                  <div className="pr-8">
                    <h3 className="font-semibold text-base mb-2">{address.title}</h3>
                    <p className="text-sm text-gray-700 mb-1">
                      {address.name}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      Telefon numarası: {address.phone}
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {address.address}
                      {address.addressLine2 && `, ${address.addressLine2}`}
                      {address.neighborhood && `, ${address.neighborhood}`}
                      {`, ${address.district && `${address.district}, `}${address.city} ${address.postalCode}`}
                    </p>

                    {address.isDefault && (
                      <div className="mt-3">
                        <span className="inline-block bg-green-100 text-green-700 text-xs px-3 py-1 rounded">
                          Varsayılan
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-4">Henüz kayıtlı adresiniz yok</p>
            <button
              onClick={handleOpenModal}
              className="text-blue-600 hover:underline font-medium"
            >
              İlk adresinizi ekleyin
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-6">Yeni bir teslimat adresi girin</h3>
              
              <div className="space-y-4">
                {/* Ülke/Bölge */}
                <div>
                  <label className="block text-sm font-medium mb-1">Ülke/Bölge</label>
                  <select className="w-full px-3 py-2 border-2 border-gray-200 rounded focus:border-gray-400 focus:outline-none">
                    <option>Türkiye</option>
                  </select>
                </div>

                {/* Tam ad */}
                <div>
                  <label className="block text-sm font-medium mb-1">Tam ad (ad ve soyad)</label>
                  <input
                    type="text"
                    value={newAddress.name}
                    onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:border-gray-400 focus:outline-none"
                  />
                </div>

                {/* Telefon */}
                <div>
                  <label className="block text-sm font-medium mb-1">Teslimat için cep telefonu</label>
                  <input
                    type="tel"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    placeholder="(5xx-xxx-xxxx)"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:border-gray-400 focus:outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Teslimata yardımcı olmak için kullanılabilir</p>
                </div>

                {/* Adres satın 1 */}
                <div>
                  <label className="block text-sm font-medium mb-1">Adres satırı 1</label>
                  <input
                    type="text"
                    value={newAddress.address}
                    onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                    placeholder="Açık adres, P.O. kutusu, şirket adı, c/o"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:border-gray-400 focus:outline-none"
                  />
                </div>

                {/* Adres satın 2 */}
                <div>
                  <input
                    type="text"
                    value={newAddress.addressLine2}
                    onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                    placeholder="Apartman, daire, ünite, bina, kat vb."
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:border-gray-400 focus:outline-none"
                  />
                </div>

                {/* Şehir */}
                <div>
                  <label className="block text-sm font-medium mb-1">Şehir</label>
                  <input
                    type="text"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:border-gray-400 focus:outline-none"
                  />
                </div>

                {/* İlçe */}
                <div>
                  <label className="block text-sm font-medium mb-1">İlçe</label>
                  <input
                    type="text"
                    value={newAddress.district}
                    onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:border-gray-400 focus:outline-none"
                  />
                </div>

                {/* Mahalle/Köy */}
                <div>
                  <label className="block text-sm font-medium mb-1">Mahalle / Köy</label>
                  <input
                    type="text"
                    value={newAddress.neighborhood}
                    onChange={(e) => setNewAddress({ ...newAddress, neighborhood: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:border-gray-400 focus:outline-none"
                  />
                </div>

                {/* Posta kodu */}
                <div>
                  <label className="block text-sm font-medium mb-1">Posta kodu</label>
                  <input
                    type="text"
                    value={newAddress.postalCode}
                    onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:border-gray-400 focus:outline-none"
                  />
                </div>

                {/* Varsayılan checkbox */}
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newAddress.isDefault}
                    onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Bunu varsayılan adresim yap</span>
                </label>
              </div>

              {/* Butonlar */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveNewAddress}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded transition-colors"
                >
                  Bu adresi kullan
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 rounded transition-colors"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}