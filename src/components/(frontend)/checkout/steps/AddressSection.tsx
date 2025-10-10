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
  addresses,
  selectedAddressId,
  onSelectAddress,
  onAddNew,
  onEdit,
}: AddressSelectorProps) {
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

      {/* Address List */}
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
    </div>
  );
}