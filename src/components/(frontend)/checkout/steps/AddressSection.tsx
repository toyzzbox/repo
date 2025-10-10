"use client";

import { useState } from "react";

type Address = {
  id: string;
  title: string;
  fullAddress: string;
  isDefault?: boolean;
};

type AddressSelectorProps = {
  addresses: Address[];
  selectedAddressId?: string;
  onSelectAddress: (addressId: string) => void;
  onAddNew: () => void;
  onEdit: (addressId: string) => void;
};

export default function AddressSelector({
  addresses = [], // ✅ Default empty array eklendi
  selectedAddressId,
  onSelectAddress,
  onAddNew,
  onEdit,
}: AddressSelectorProps) {
  
  // ✅ Boş adres durumu kontrolü
  const hasAddresses = addresses && addresses.length > 0;

  return (
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
          onClick={onAddNew}
          className="flex items-center gap-1 text-sm font-medium hover:underline"
        >
          Yeni Adres Ekle
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>

      {/* Address List or Empty State */}
      {!hasAddresses ? (
        // ✅ Boş durum UI'ı
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-gray-500 mb-4">Henüz kayıtlı adresiniz bulunmamaktadır</p>
          <button
            onClick={onAddNew}
            className="inline-flex items-center gap-2 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            İlk Adresinizi Ekleyin
          </button>
        </div>
      ) : (
        // ✅ Adres listesi
        <div className="space-y-3">
          {addresses.map((address) => {
            const isSelected = selectedAddressId === address.id;
            
            return (
              <button
                key={address.id}
                onClick={() => onSelectAddress(address.id)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all relative ${
                  isSelected
                    ? "border-black bg-white"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {/* Checkmark */}
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
                  {/* Title */}
                  <h3 className="font-semibold text-base mb-2">{address.title}</h3>

                  {/* Address */}
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    {address.fullAddress}
                  </p>

                  {/* Tags & Actions */}
                  <div className="flex items-center gap-2">
                    {address.isDefault && (
                      <span className="inline-block bg-green-100 text-green-700 text-xs px-3 py-1 rounded">
                        Varsayılan
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(address.id);
                      }}
                      className="text-sm hover:underline flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}