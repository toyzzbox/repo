"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const steps = ["address", "delivery", "payment", "summary"] as const;
type Step = typeof steps[number];

interface FormData {
  address: {
    name: string;
    phone: string;
    address: string;
    city: string;
  };
  delivery: {
    method: string;
    date: string;
  };
  payment: {
    method: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  };
}

function ProgressBar({ step }: { step: Step }) {
  const stepLabels = ["Adres", "Kargo", "Ödeme", "Özet"];
  const currentIndex = steps.indexOf(step);
  
  return (
    <div className="flex justify-between mb-6">
      {stepLabels.map((label, index) => (
        <div
          key={label}
          className={`flex-1 text-center text-sm ${
            index <= currentIndex ? "font-bold text-black" : "text-gray-400"
          }`}
        >
          <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
            index <= currentIndex ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}>
            {index + 1}
          </div>
          {label}
        </div>
      ))}
    </div>
  );
}

function AddressSection({ data, onChange, errors }: {
  data: FormData['address'];
  onChange: (data: FormData['address']) => void;
  errors: Record<string, string>;
}) {
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
        </select>
        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
      </div>
    </div>
  );
}

function DeliverySection({ data, onChange }: {
  data: FormData['delivery'];
  onChange: (data: FormData['delivery']) => void;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Kargo Seçenekleri</h2>
      <div className="space-y-3">
        <div 
          className={`p-4 border rounded-lg cursor-pointer ${
            data.method === 'standard' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
          }`}
          onClick={() => onChange({ ...data, method: 'standard' })}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Standart Kargo</h3>
              <p className="text-sm text-gray-600">3-5 iş günü</p>
            </div>
            <span className="font-semibold">₺19.90</span>
          </div>
        </div>
        <div 
          className={`p-4 border rounded-lg cursor-pointer ${
            data.method === 'express' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
          }`}
          onClick={() => onChange({ ...data, method: 'express' })}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Hızlı Kargo</h3>
              <p className="text-sm text-gray-600">1-2 iş günü</p>
            </div>
            <span className="font-semibold">₺39.90</span>
          </div>
        </div>
      </div>
      {data.method && (
        <div>
          <label className="block text-sm font-medium mb-1">Tercih Edilen Teslimat Tarihi</label>
          <input
            type="date"
            value={data.date}
            onChange={(e) => onChange({ ...data, date: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      )}
    </div>
  );
}

function PaymentSection({ data, onChange, errors }: {
  data: FormData['payment'];
  onChange: (data: FormData['payment']) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Ödeme Bilgileri</h2>
      <div className="space-y-3">
        <div 
          className={`p-4 border rounded-lg cursor-pointer ${
            data.method === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
          }`}
          onClick={() => onChange({ ...data, method: 'card' })}
        >
          <div className="flex items-center">
            <input type="radio" checked={data.method === 'card'} readOnly className="mr-3" />
            <span className="font-medium">Kredi/Banka Kartı</span>
          </div>
        </div>
        <div 
          className={`p-4 border rounded-lg cursor-pointer ${
            data.method === 'transfer' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
          }`}
          onClick={() => onChange({ ...data, method: 'transfer' })}
        >
          <div className="flex items-center">
            <input type="radio" checked={data.method === 'transfer'} readOnly className="mr-3" />
            <span className="font-medium">Havale/EFT</span>
          </div>
        </div>
      </div>
      
      {data.method === 'card' && (
        <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium mb-1">Kart Numarası</label>
            <input
              type="text"
              value={data.cardNumber}
              onChange={(e) => onChange({ ...data, cardNumber: e.target.value })}
              className={`w-full p-2 border rounded-md ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
            />
            {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Son Kullanma</label>
              <input
                type="text"
                value={data.expiryDate}
                onChange={(e) => onChange({ ...data, expiryDate: e.target.value })}
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
                onChange={(e) => onChange({ ...data, cvv: e.target.value })}
                className={`w-full p-2 border rounded-md ${errors.cvv ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="123"
                maxLength={3}
              />
              {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CheckoutSummary({ subtotal, shipping, discount, formData }: {
  subtotal: number;
  shipping: number;
  discount: number;
  formData: FormData;
}) {
  const total = subtotal + shipping - discount;
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Sipariş Özeti</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Teslimat Adresi</h3>
            <p className="text-sm">{formData.address.name}</p>
            <p className="text-sm">{formData.address.phone}</p>
            <p className="text-sm">{formData.address.address}</p>
            <p className="text-sm">{formData.address.city}</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Kargo</h3>
            <p className="text-sm">
              {formData.delivery.method === 'standard' ? 'Standart Kargo (3-5 iş günü)' : 'Hızlı Kargo (1-2 iş günü)'}
            </p>
            {formData.delivery.date && (
              <p className="text-sm">Tercih: {formData.delivery.date}</p>
            )}
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Ödeme</h3>
            <p className="text-sm">
              {formData.payment.method === 'card' ? 'Kredi/Banka Kartı' : 'Havale/EFT'}
            </p>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-4">Fiyat Detayları</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Ürün Toplamı:</span>
              <span>₺{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Kargo:</span>
              <span>₺{shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>İndirim:</span>
              <span>-₺{discount.toFixed(2)}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-bold text-lg">
              <span>Toplam:</span>
              <span>₺{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutForm() {
  const [stepIndex, setStepIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<FormData>({
    address: {
      name: '',
      phone: '',
      address: '',
      city: ''
    },
    delivery: {
      method: '',
      date: ''
    },
    payment: {
      method: '',
      cardNumber: '',
      expiryDate: '',
      cvv: ''
    }
  });

  const step = steps[stepIndex];

  const validateStep = (currentStep: Step): boolean => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 'address':
        if (!formData.address.name) newErrors.name = 'Ad soyad gerekli';
        if (!formData.address.phone) newErrors.phone = 'Telefon gerekli';
        if (!formData.address.address) newErrors.address = 'Adres gerekli';
        if (!formData.address.city) newErrors.city = 'Şehir seçimi gerekli';
        break;
      
      case 'delivery':
        if (!formData.delivery.method) {
          alert('Lütfen bir kargo seçeneği seçiniz');
          return false;
        }
        break;
      
      case 'payment':
        if (!formData.payment.method) {
          alert('Lütfen bir ödeme yöntemi seçiniz');
          return false;
        }
        if (formData.payment.method === 'card') {
          if (!formData.payment.cardNumber) newErrors.cardNumber = 'Kart numarası gerekli';
          if (!formData.payment.expiryDate) newErrors.expiryDate = 'Son kullanma tarihi gerekli';
          if (!formData.payment.cvv) newErrors.cvv = 'CVV gerekli';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const next = () => {
    if (validateStep(step)) {
      if (stepIndex < steps.length - 1) {
        setStepIndex((i) => i + 1);
        setErrors({});
      }
    }
  };

  const back = () => {
    if (stepIndex > 0) {
      setStepIndex((i) => i - 1);
      setErrors({});
    }
  };

  const handleComplete = () => {
    alert('Sipariş başarıyla tamamlandı! 🎉');
    // Burada gerçek uygulamada API çağrısı yapılır
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <ProgressBar step={step} />
      
      <div className="bg-white rounded-lg shadow-sm border p-6">
        {step === "address" && (
          <AddressSection 
            data={formData.address}
            onChange={(data) => setFormData(prev => ({ ...prev, address: data }))}
            errors={errors}
          />
        )}
        {step === "delivery" && (
          <DeliverySection 
            data={formData.delivery}
            onChange={(data) => setFormData(prev => ({ ...prev, delivery: data }))}
          />
        )}
        {step === "payment" && (
          <PaymentSection 
            data={formData.payment}
            onChange={(data) => setFormData(prev => ({ ...prev, payment: data }))}
            errors={errors}
          />
        )}
        {step === "summary" && (
          <CheckoutSummary 
            subtotal={749.9} 
            shipping={formData.delivery.method === 'express' ? 39.9 : 19.9} 
            discount={20}
            formData={formData}
          />
        )}
      </div>

      <div className="flex justify-between">
        {stepIndex > 0 && (
          <Button variant="outline" onClick={back} className="px-6">
            ← Geri
          </Button>
        )}
        
        <div className="ml-auto">
          {stepIndex < steps.length - 1 ? (
            <Button onClick={next} className="px-6">
              Devam Et →
            </Button>
          ) : (
            <Button onClick={handleComplete} className="px-6 bg-green-600 hover:bg-green-700">
              Siparişi Onayla ✓
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}