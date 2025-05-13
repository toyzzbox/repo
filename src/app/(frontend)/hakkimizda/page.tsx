// src/app/hakkimizda/page.tsx

import React from 'react';

const HakkimizdaPage = () => {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8"> {/* Ekran boyutlarına göre padding ayarlandı */}
      <section className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Hakkımızda</h1> {/* Başlık boyutu ayarlandı */}
        <p className="text-gray-700 leading-relaxed">
          Merhaba! Biz, çocukların hayal dünyasını renklendirmeyi ve onların gelişimine katkıda bulunmayı kendine misyon edinmiş bir ekip olarak yola çıktık. Toyzz
          Box, oyuncak dünyasının büyülü kapılarını aralayan, güvenilir ve eğlenceli bir e-ticaret platformu olarak 1999 yılından bu yana sizlerle buluşuyor.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Amacımız</h2> {/* Başlık boyutu ayarlandı */}
        <p className="text-gray-700 leading-relaxed">
          Amacımız, sadece oyuncak satmak değil, aynı zamanda çocukların fiziksel, zihinsel ve duygusal gelişimlerine destek olacak ürünler sunmaktır. Her bir
          oyuncağı özenle seçiyor, kalite ve güvenilirlikten ödün vermeden sizlere ulaştırıyoruz. Çünkü biliyoruz ki, oyuncaklar çocukların dünyayı keşfetme,
          öğrenme ve kendini ifade etme yolunda en büyük yardımcılarıdır.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Neden Bizi Tercih Etmelisiniz?</h2> {/* Başlık boyutu ayarlandı */}
        <ul className="list-disc pl-5 text-gray-700 leading-relaxed">
          <li>
            <strong>Kaliteli ve Güvenilir Ürünler:</strong> Tüm ürünlerimiz, uluslararası standartlara uygun olarak seçilir ve test edilir. Çocuklarınızın güvenliği
            bizim için her zaman ön plandadır.
          </li>
          <li>
            <strong>Geniş Ürün Yelpazesi:</strong> Bebek oyuncaklarından eğitici setlere, puzzle'lardan sanat malzemelerine kadar her yaşa ve ilgi alanına uygun çeşitli
            ürünler sunuyoruz.
          </li>
          <li>
            <strong>Uygun Fiyatlar:</strong> Kaliteli oyuncakları herkesin ulaşabileceği fiyatlarla sunarak, mutlu çocukların sayısını artırmayı hedefliyoruz.
          </li>
          <li>
            <strong>Hızlı ve Güvenilir Teslimat:</strong> Siparişleriniz en kısa sürede, özenle paketlenerek kapınıza kadar ulaştırılır.
          </li>
          <li>
            <strong>Müşteri Memnuniyeti:</strong> Sizlerin memnuniyeti bizim için en büyük motivasyon kaynağıdır. Her türlü soru ve öneriniz için 7/24 destek ekibimiz
            yanınızda.
          </li>
        </ul>
      </section>

      <section>
        <p className="text-gray-700 leading-relaxed">
          Biz, Toyzz Box olarak, her çocuğun birbirinden özel olduğuna inanıyoruz. Bu yüzden, her bir oyuncağın çocukların hayatına dokunmasını ve onlara unutulmaz
          anılar bırakmasını istiyoruz. Siz de bu büyülü dünyaya adım atın ve çocuklarınızın gözlerindeki mutluluğu birlikte keşfedelim.
        </p>
        <p className="text-gray-700 leading-relaxed mt-4">Bizi tercih ettiğiniz için teşekkür ederiz. Sizin ve çocuklarınızın mutluluğu, bizim en büyük ödülümüz!</p>
      </section>
    </div>
  );
};

export default HakkimizdaPage;
