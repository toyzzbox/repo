"use client";

import { Truck, ShieldCheck, Clock, RefreshCw, Phone, ShoppingCart } from "lucide-react";

const FeaturesBar = () => {
  const features = [
    { icon: <ShieldCheck className="w-6 h-6 text-blue-500" />, title: "SSL Sertifikası", description: "Güvenli Alışveriş" },
    { icon: <Truck className="w-6 h-6 text-green-500" />, title: "Hızlı Gönderim", description: "Aynı Gün Kargo İmkanı" },
    { icon: <RefreshCw className="w-6 h-6 text-purple-500" />, title: "Kolay İade", description: "Koşulsuz 14 Gün İade Hakkı" },
    { icon: <Phone className="w-6 h-6 text-orange-500" />, title: "Müşteri Destek Hattı", description: "0216 499 1 999" },
  ];

  return (
    <div className="bg-gray-50 py-6 px-4 md:px-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            {feature.icon}
            <p className="font-semibold text-gray-700">{feature.title}</p>
            <p className="text-sm text-gray-500">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesBar;
