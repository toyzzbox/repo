// components/PaymentSection.tsx

import { useState } from "react";
import { CreditCard } from "lucide-react";
import { PaymentSectionProps } from "../types";

export default function PaymentSection({ data, onChange, errors }: PaymentSectionProps) {
  const [showCardPreview, setShowCardPreview] = useState(false);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
    }
    return v;
  };

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value);
    onChange({ ...data, cardNumber: formatted });
    setShowCardPreview(value.replace(/\s/g, '').length > 0);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Ödeme Bilgileri</h2>
      
      <div className="space-y-3">
        <div 
          className={`p-4 border rounded-lg cursor-pointer transition-all ${
            data.method === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onChange({ ...data, method: 'card' })}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input type="radio" checked={data.method === 'card'} onChange={() => {}} className="mr-3" tabIndex={-1} />
              <div>
                <span className="font-medium">Kredi/Banka Kartı</span>
                <p className="text-sm text-gray-600">Visa, Mastercard, American Express</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center">V</div>
              <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center">M</div>
            </div>
          </div>
        </div>
        
        <div 
          className={`p-4 border rounded-lg cursor-pointer transition-all ${
            data.method === 'transfer' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onChange({ ...data, method: 'transfer' })}
        >
          <div className="flex items-center">
            <input type="radio" checked={data.method === 'transfer'} onChange={() => {}} className="mr-3" tabIndex={-1} />
            <div>
              <span className="font-medium">Havale/EFT</span>
              <p className="text-sm text-gray-600">Banka havalesi ile ödeme</p>
            </div>
          </div>
        </div>

        <div 
          className={`p-4 border rounded-lg cursor-pointer transition-all ${
            data.method === 'installment' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onChange({ ...data, method: 'installment' })}
        >
          <div className="flex items-center">
            <input type="radio" checked={data.method === 'installment'} onChange={() => {}} className="mr-3" tabIndex={-1} />
            <div>
              <span className="font-medium">Taksitli Ödeme</span>
              <p className="text-sm text-gray-600">2-12 ay vade seçenekleri</p>
            </div>
          </div>
        </div>
      </div>
      
      {data.method === 'card' && (
        <div className="grid md:grid-cols-2 gap-6 mt-4">
          {/* Sol Taraf - Form */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium">Kart Bilgileri</h3>
            <div>
              <label className="block text-sm font-medium mb-1">Kart Numarası</label>
              <div className="relative">
                <input
                  type="text"
                  value={data.cardNumber}
                  onChange={(e) => handleCardNumberChange(e.target.value)}
                  className={`w-full p-2 border rounded-md pr-10 ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
                <CreditCard className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
              {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Son Kullanma</label>
                <input
                  type="text"
                  value={data.expiryDate}
                  onChange={(e) => onChange({ ...data, expiryDate: formatExpiryDate(e.target.value) })}
                  className={`w-full p-2 border rounded-md ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="MM/YY"
                  maxLength={5}
                />
                {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CVV</label>
                <input
                  type="text"
                  value={data.cvv}
                  onChange={(e) => onChange({ ...data, cvv: e.target.value.replace(/[^0-9]/g, '') })}
                  className={`w-full p-2 border rounded-md ${errors.cvv ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="123"
                  maxLength={3}
                />
                {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
              </div>
            </div>
            
            <div className="text-xs text-gray-500 space-y-1">
              <p>💳 Kartınızdan ödeme güvenli SSL sertifikası ile alınacaktır.</p>
              <p>🔒 Kart bilgileriniz saklanmaz ve 3D Secure ile korunur.</p>
            </div>
          </div>

          {/* Sağ Taraf - Kart Önizleme */}
          <div className="flex items-center justify-center p-4">
            {showCardPreview ? (
              <div className="w-full max-w-sm">
                <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-xl p-6 shadow-2xl text-white aspect-[1.586/1] relative overflow-hidden">
                  {/* Dekoratif Arka Plan Deseni */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
                  </div>

                  {/* Kart İçeriği */}
                  <div className="relative z-10">
                    {/* Üst Kısım - Chip ve Logo */}
                    <div className="flex justify-between items-start mb-8">
                      <div className="w-12 h-9 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-md opacity-90 flex items-center justify-center">
                        <div className="w-8 h-6 border border-yellow-700 rounded-sm"></div>
                      </div>
                      <CreditCard className="w-10 h-10 opacity-50" />
                    </div>

                    {/* Kart Numarası */}
                    <div className="mb-6">
                      <p className="text-2xl font-mono tracking-widest">
                        {data.cardNumber || "•••• •••• •••• ••••"}
                      </p>
                    </div>

                    {/* Alt Bilgiler */}
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs opacity-60 mb-1">Son Kullanma Tarihi</p>
                        <p className="font-mono text-base tracking-wider">
                          {data.expiryDate || "MM/YY"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs opacity-60 mb-1">CVV</p>
                        <p className="font-mono text-base">
                          {data.cvv ? "•".repeat(data.cvv.length) : "•••"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <CreditCard className="w-16 h-16 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Kart bilgilerinizi girin</p>
              </div>
            )}
          </div>
        </div>
      )}

      {data.method === 'transfer' && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium mb-2">Havale Bilgileri</h3>
          <div className="text-sm space-y-1">
            <p><strong>Banka:</strong> Türkiye İş Bankası</p>
            <p><strong>Hesap Sahibi:</strong> ŞİRKET ADI A.Ş.</p>
            <p><strong>IBAN:</strong> TR12 0006 4000 0011 2345 6789 01</p>
            <p><strong>Açıklama:</strong> Sipariş No: #12345</p>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            * Havale/EFT sonrası siparişiniz 1-2 iş günü içinde kargoya verilir.
          </p>
        </div>
      )}

      {data.method === 'installment' && (
        <div className="mt-4 p-4 bg-purple-50 rounded-lg">
          <h3 className="font-medium mb-3">Taksit Seçenekleri</h3>
          <div className="space-y-2">
            {[2, 3, 6, 9, 12].map((month) => (
              <div key={month} className="flex justify-between items-center p-2 bg-white rounded border hover:border-purple-500 cursor-pointer">
                <span className="text-sm">{month} Taksit</span>
                <span className="text-sm font-medium">Aylık ~₺{(1000 / month).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}