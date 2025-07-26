"use client";

import { useState, useCallback } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactMap() {
  const [isMapVisible, setIsMapVisible] = useState(false);

  const handleMapLoad = useCallback(() => {
    setIsMapVisible(true);
  }, []);

  return (
    <div className="grid md:grid-cols-2 gap-6 bg-white shadow-lg rounded-2xl p-6">
      {/* Harita Bölümü */}
      <div className="h-[350px] w-full rounded-lg overflow-hidden relative">
        {isMapVisible ? (
          <iframe
            title="Toyzz Box Konum"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3011.4086900127227!2d28.907383976153852!3d40.994427171352456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cabbd176975aff%3A0xd0dad4094535a612!2sToyzz%20Box!5e0!3m2!1str!2str!4v1748762750421!5m2!1str!2str"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-lg"
          />
        ) : (
          <button
            className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center cursor-pointer text-gray-700 hover:from-gray-200 hover:to-gray-300 transition-all duration-300 group rounded-lg"
            onClick={handleMapLoad}
            aria-label="Haritayı yüklemek için tıklayın"
          >
            <MapPin className="w-8 h-8 mb-2 text-gray-500 group-hover:text-gray-700 transition-colors" />
            <span className="text-sm md:text-base font-medium">
              Haritayı yüklemek için tıklayın
            </span>
          </button>
        )}
      </div>

      {/* İletişim Bilgileri */}
      <div className="flex flex-col justify-center space-y-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">İletişim Bilgileri</h2>
        
        {/* Adres */}
        <div className="flex items-start space-x-3">
          <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-gray-800 font-medium">Adres</p>
            <p className="text-gray-600 text-sm">
              Olivium AVM Karşısı, Gökalp Mah., Zeytinburnu / İstanbul
            </p>
          </div>
        </div>

        {/* Telefon */}
        <div className="flex items-center space-x-3">
          <Phone className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div>
            <p className="text-gray-800 font-medium">Telefon</p>
            <a 
              href="tel:02125100565" 
              className="text-green-600 hover:text-green-700 hover:underline transition-colors text-sm"
            >
              0212 510 05 65
            </a>
          </div>
        </div>

        {/* E-posta */}
        <div className="flex items-center space-x-3">
          <Mail className="w-5 h-5 text-purple-600 flex-shrink-0" />
          <div>
            <p className="text-gray-800 font-medium">E-posta</p>
            <a 
              href="mailto:info@toyzzbox.com" 
              className="text-purple-600 hover:text-purple-700 hover:underline transition-colors text-sm"
            >
              info@toyzzbox.com
            </a>
          </div>
        </div>

        {/* Çalışma Saatleri */}
        <div className="flex items-center space-x-3 pt-2">
          <Clock className="w-5 h-5 text-orange-600 flex-shrink-0" />
          <div>
            <p className="text-gray-800 font-medium">Açılış Saatleri</p>
            <p className="text-gray-600 text-sm">09:30 - 22:30</p>
          </div>
        </div>

        {/* İletişim Butonu (Opsiyonel) */}
        <div className="pt-4">
          <a
            href="tel:02125100565"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Phone className="w-4 h-4 mr-2" />
            Hemen Ara
          </a>
        </div>
      </div>
    </div>
  );
}