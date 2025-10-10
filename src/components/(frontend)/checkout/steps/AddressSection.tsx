"use client";

import { useState } from "react";

type AddressData = {
  name: string;
  phone: string;
  address: string;
  addressLine2?: string;
  city: string;
  district: string;
  neighborhood?: string;
  postalCode: string;
};

type SavedAddress = AddressData & {
  id: string;
  title: string;
  isDefault?: boolean;
};

type AddressSelectorProps = {
  data: AddressData | null;
  onChange: (data: AddressData) => void;
  errors?: Record<string, string>;
  savedAddresses?: SavedAddress[];
  onSaveAddress?: (address: SavedAddress) => void;
};

export default function AddressSelector({
  data,
  onChange,
  errors = {},
  savedAddresses = [],
  onSaveAddress,
}: AddressSelectorProps) {
  const [showModal, setShowModal] = useState(false);
  const [newAddress, setNewAddress] = useState<SavedAddress>({
    id: "",
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
    savedAddresses.find((a) => a.isDefault)?.id || null
  );

  // ✅ Kayıtlı adres seçimi
  const handleSelectAddress = (address: SavedAddress) => {
    setSelectedAddressId(address.id);
    onChange({
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

  // ✅ Modal açma
  const handleOpenModal = () => {
    setNewAddress({
      id: "",
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

  // ✅ Yeni adres kaydetme
  const handleSaveNewAddress = () => {
    if (!newAddress.name || !newAddress.address || !newAddress.city) {
      alert("Lütfen zorunlu alanları doldurun.");
      return;
    }

    const id = Math.random().toString(36).substring(2, 9);
    const finalAddress = { ...newAddress, id };

    onSaveAddress?.(finalAddress);
    onChange(finalAddress);
    setSelectedAddressId(id);
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
              <path
                fillRule="evenodd"
                d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                clipRule="evenodd"
              />
            </svg>
            Fatura ve Teslimat Adresi
          </h2>
          <button
            onClick={handleOpenModal}
            className="flex items-center gap-1 text-sm font-medium hover:underline"
          >
            Yeni Adres Ekle
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
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
                  {/* Radio seçimi */}
                  <div className="absolute top-4 right-4">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? "border-black bg-black"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {isSelected && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </div>

                  <div className="pr-8">
                    <h3 className="font-semibold text-base mb-2">{address.title}</h3>
                    <p className="text-sm text-gray-700 mb-1">{address.name}</p>
                    <p className="text-sm text-gray-600 mb-1">
                      Telefon: {address.phone}
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {address.address}
                      {address.addressLine2 && `, ${address.addressLine2}`}
                      {address.neighborhood && `, ${address.neighborhood}`}
                      {`, ${address.district}, ${address.city} ${address.postalCode}`}
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
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[100] p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">
                  Yeni Teslimat Adresi
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              {/* Form */}
              <div className="space-y-4">
                {[
                  { label: "Adres Başlığı", key: "title" },
                  { label: "Tam Ad", key: "name" },
                  { label: "Telefon", key: "phone" },
                  { label: "Adres Satırı 1", key: "address" },
                  { label: "Adres Satırı 2", key: "addressLine2" },
                  { label: "Şehir", key: "city" },
                  { label: "İlçe", key: "district" },
                  { label: "Mahalle/Köy", key: "neighborhood" },
                  { label: "Posta Kodu", key: "postalCode" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium mb-1">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      value={(newAddress as any)[field.key] || ""}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          [field.key]: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:border-gray-400 focus:outline-none"
                    />
                  </div>
                ))}

                {/* Varsayılan adres seçimi */}
                <label className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={newAddress.isDefault}
                    onChange={(e) =>
                      setNewAddress({
                        ...newAddress,
                        isDefault: e.target.checked,
                      })
                    }
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

      {/* Hata mesajı */}
      {errors?.address && (
        <p className="text-red-500 text-sm mt-2">{errors.address}</p>
      )}
    </>
  );
}
