"use client";
import { useState } from "react";

export default function ContactMap() {
  const [isMapVisible, setIsMapVisible] = useState(false);

  return (
    <div className="grid md:grid-cols-2 gap-6 bg-white shadow-lg rounded-2xl p-6">
      {/* Harita */}
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
          />
        ) : (
          <div
            className="h-full w-full bg-gray-200 flex items-center justify-center cursor-pointer text-gray-700 text-sm md:text-base hover:bg-gray-300 transition"
            onClick={() => setIsMapVisible(true)}
            aria-label="Haritayı yüklemek için tıklayın"
          >
            Haritayı yüklemek için tıklayın
          </div>
        )}
      </div>

      {/* Bilgiler */}
      <div className="flex flex-col justify-center space-y-2">
        <h2 className="text-lg font-semibold mb-2">İletişim Bilgileri</h2>
        <p>📍 Olivium AVM Karşısı, Gökalp Mah., Zeytinburnu / İstanbul</p>
        <p>
          📞 <a href="tel:02125100565" className="text-blue-600 hover:underline">0212 510 05 65</a>
        </p>
        <p>
          ✉️ <a href="mailto:info@toyzzbox.com" className="text-blue-600 hover:underline">info@toyzzbox.com</a>
        </p>
        <p className="mt-4">🕒 Açılış Saatleri: 09:30 - 22:30</p>
      </div>
    </div>
  );
}
