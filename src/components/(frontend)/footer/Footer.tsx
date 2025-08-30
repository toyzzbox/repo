'use client';

import Link from 'next/link';
import FeaturesBar from './Option';

const Footer = () => {
  return (
<footer className="hidden lg:block bg-white">
      <div className="mx-auto max-w-screen-xl px-4 pb-6 pt-16 sm:px-6 lg:px-8">
                  {/* Tüm Kategoriler */}  <div>
    <FeaturesBar/>
        <div className="mt-2 grid grid-cols-1 gap-8 border-t border-gray-100 pt-2 md:grid-cols-4 lg:grid-cols-6">

  </div>
          <div className="text-center sm:text-left">
            <p className="text-lg font-medium text-gray-900">Tüm Kategoriler</p>
            <span className="h-px w-10 bg-red-500 block m-1 rounded" />
            <ul className="mt-8 space-y-4 text-sm">
              {["Oyuncaklar", "Anne & Bebek", "Spor & Outdoor", "Okul & Kırtasiye", "Karakterler"].map((item) => (
                <li key={item}>
                  <Link href="/" className="text-gray-700 transition hover:text-gray-700/75">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popüler Markalar */}
          <div className="text-center sm:text-left">
            <p className="text-lg font-medium text-gray-900">Popüler Markalar</p>
            <span className="h-px w-10 bg-red-500 block m-1 rounded" />
            <ul className="mt-8 space-y-4 text-sm">
              {["Barbie", "Hot Wheels", "Fisher Price", "Polly Pocket"].map((item) => (
                <li key={item}>
                  <Link href="/" className="text-gray-700 transition hover:text-gray-700/75">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popüler Kategoriler */}
          <div className="text-center sm:text-left">
            <p className="text-lg font-medium text-gray-900">Popüler Kategoriler</p>
            <span className="h-px w-10 bg-red-500 block m-1 rounded" />
            <ul className="mt-8 space-y-4 text-sm">
              <li>
                <Link href="/" className="text-gray-700 transition hover:text-gray-700/75">Oyuncak Bebekler</Link>
              </li>
              <li>
                <Link href="/" className="text-gray-700 transition hover:text-gray-700/75">Oyuncak Arabalar</Link>
              </li>
              <li>
                <Link href="/" className="text-gray-700 transition hover:text-gray-700/75">Kutu Oyunları</Link>
              </li>
              <li>
                <a href="/" className="text-gray-700 transition hover:text-gray-700/75">Downloads</a>
              </li>
              <li>
                <a href="/" className="text-gray-700 transition hover:text-gray-700/75">Upcoming Events</a>
              </li>
            </ul>
          </div>

          {/* Müşteri Hizmetleri */}
          <div className="text-center sm:text-left">
            <p className="text-lg font-medium text-gray-900">Müşteri Hizmetleri</p>
            <span className="h-px w-10 bg-red-500 block m-1 rounded" />
            <ul className="mt-8 space-y-4 text-sm">
              <li><a href="/" className="text-gray-700 transition hover:text-gray-700/75">FAQs</a></li>
              <li><a href="/" className="text-gray-700 transition hover:text-gray-700/75">Support</a></li>
              <li>
                <a href="/" className="group flex justify-center gap-1.5 sm:justify-start">
                  <span className="text-gray-700 transition group-hover:text-gray-700/75">Live Chat</span>
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500" />
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Bülten */}
          <div className="text-center sm:text-left md:col-span-4 lg:col-span-2">
            <p className="text-lg font-medium text-gray-900">Bültenimize Abone Olun</p>
            <span className="h-px w-10 bg-red-500 block m-1 rounded" />
            <div className="mx-auto mt-8 max-w-md">
              <p className="text-center leading-relaxed text-gray-500 sm:text-left">
                Kampanya, indirim ve fırsatlardan önce sizin haberiniz olsun!
              </p>
              <form className="mt-4">
                <div className="flex flex-col gap-4 sm:flex-row lg:flex-col lg:items-start">
                  <label htmlFor="email" className="sr-only">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Email Adresiniz"
                    className="w-full rounded-full border-gray-200 px-6 py-3 shadow-sm"
                  />
                  <button
                    type="submit"
                    className="block rounded-full bg-red-500 px-8 py-3 font-medium text-white transition hover:bg-red-600"
                  >
                    Abone Ol
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Alt Bilgi */}
        <div className="mt-16 border-t border-gray-100 pt-6 sm:flex sm:items-center sm:justify-between">
          <p className="text-center text-sm text-gray-500 sm:text-left">
            &copy; 2022. Tüm hakları saklıdır.
          </p>
          <ul className="mt-4 flex justify-center gap-6 sm:mt-0 sm:justify-start">
            {/* Sosyal Medya simgeleri (simgeler burada kısaltıldı) */}
            {/* Detay ikonları kullanılmaya devam edebilir */}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
