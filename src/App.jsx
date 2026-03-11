import { useState, useEffect, useRef } from 'react';
import { getAllPrices } from './services/goldPriceService';
import logo from './assets/logo.jpg';

// Cloudinary medya galerisi (resim ve video)
const galleryMedia = [
  'https://res.cloudinary.com/dixdnau9g/image/upload/v1773235670/IMG_3152_ds6zih.jpg',
  'https://res.cloudinary.com/dixdnau9g/image/upload/v1773235670/IMG_3154_ybc1gb.jpg',
  'https://res.cloudinary.com/dixdnau9g/image/upload/v1773235677/IMG_8936_ywxkhn.jpg',
  'https://res.cloudinary.com/dixdnau9g/video/upload/v1773235676/copy_391065C4-A439-4958-A5B9-B9DD9F443844_zbxnvp.mp4',
  'https://res.cloudinary.com/dixdnau9g/video/upload/v1773235662/4c9252b3dd224e69af37b4e273b3de97_vdvtlp.mp4',
  'https://res.cloudinary.com/dixdnau9g/video/upload/v1773235660/be9b896d762547ea8e9e3cef551ac6c3_zjbkh5.mp4',
  'https://res.cloudinary.com/dixdnau9g/image/upload/v1773235682/IMG_3149_drynnh.jpg',
  'https://res.cloudinary.com/dixdnau9g/image/upload/v1773235687/IMG_3148_mezvde.jpg',
  'https://res.cloudinary.com/dixdnau9g/image/upload/v1773235692/IMG_3150_eezy8f.jpg',
  'https://res.cloudinary.com/dixdnau9g/video/upload/v1773235691/IMG_9309_odxwym.mp4',
];

const CONTACT = {
  instagram: 'https://instagram.com/dogakuyumculuk63',
  tiktok: 'https://www.tiktok.com/@dogakuyumculuk63_',
  phone: '0533 434 76 96',
  phoneLink: 'tel:+905334347696',
  addressLine1: 'Mimar Sinan Mahallesi 101. sokak',
  addressLine2: 'Kerem Ezer Apartmanı Altı. No:1/D Haliliye/Şanlıurfa',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Do%C4%9Fa+kuyumculuk%2C+Mimar+Sinan%2C+101.+Sk.%2C+63100+Haliliye%2F%C5%9Eanl%C4%B1urfa',
};

const isVideo = (url) => /\.(mp4|mov|webm|ogg)$/i.test(url);

function MediaSlideshow({ mediaList, slideDuration = 10000, startIndex = 0 }) {
  const [index, setIndex] = useState(startIndex % Math.max(1, mediaList.length));
  const videoRef = useRef(null);

  const displayIndex = index % mediaList.length;
  const current = mediaList[displayIndex];
  const src = current;
  const isFirst = displayIndex === 0;
  const currentIsVideo = isVideo(current);

  const goToNext = () => setIndex((i) => (i + 1) % mediaList.length);

  // Resimlerde sabit süre, videolarda video bitene kadar (onEnded ile)
  useEffect(() => {
    if (currentIsVideo) return;
    const t = setInterval(goToNext, slideDuration);
    return () => clearInterval(t);
  }, [displayIndex, currentIsVideo, mediaList.length, slideDuration]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !currentIsVideo) return;
    // Güvenlik için sesi tamamen kapat
    v.muted = true;
    v.volume = 0;
    v.play().catch(goToNext);
  }, [displayIndex, current]);

  if (!mediaList.length) return null;

  return (
    <div className="relative flex-1 min-h-0 w-full rounded-3xl border border-amber-400/70 bg-slate-900/80 shadow-2xl overflow-hidden">
      {/* Arka plan media — geçişte fade efekti */}
      <div className="absolute inset-0 flex items-center justify-center bg-black">
        <div key={displayIndex} className="absolute inset-0 flex items-center justify-center slide-fade-in">
          {currentIsVideo ? (
            <video
              ref={videoRef}
              src={src}
              className="max-w-full max-h-full object-contain"
              muted
              playsInline
              preload={isFirst ? 'metadata' : 'none'}
              onEnded={goToNext}
              onError={goToNext}
            />
          ) : (
            <img
              src={src}
              alt="Doğa Kuyumculuk"
              className="max-w-full max-h-full object-contain"
              loading={isFirst ? 'eager' : 'lazy'}
              fetchPriority={isFirst ? 'high' : 'auto'}
              onError={goToNext}
            />
          )}
        </div>
      </div>

      {/* Üstte hafif degrade */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/10 to-slate-900/60" />

      {/* İç çerçeve efekti */}
      <div className="absolute inset-[6px] rounded-2xl border border-amber-200/20 pointer-events-none" />

      {/* Alt etiket */}
      <div className="absolute inset-x-4 bottom-4 flex items-center justify-between text-[11px] text-amber-50">
        <span className="uppercase tracking-[0.18em] text-amber-200/90 font-medium bg-slate-900/40 px-3 py-1 rounded-full border border-amber-300/60">
          Doğa Kuyumculuk
        </span>
      </div>
    </div>
  );
}

function App() {
  const [prices, setPrices] = useState(null);
  const [previousPrices, setPreviousPrices] = useState(null);
  const [loading, setLoading] = useState(true);
  const pricesRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllPrices();
        if (pricesRef.current) setPreviousPrices(pricesRef.current);
        pricesRef.current = data;
        setPrices(data);
      } catch (error) {
        console.error('Veri çekme hatası:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num) => {
    if (!num) return '—';
    return num.toLocaleString('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatTime = (date) => {
    if (!date) return '—';
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    return `${d}.${m}.${date.getFullYear()}`;
  };

  const getPriceChange = (currentPrice, previousPrice) => {
    if (!previousPrice?.alis || !currentPrice?.alis) return null;
    const cur = parseFloat(currentPrice.alis);
    const prev = parseFloat(previousPrice.alis);
    if (isNaN(cur) || isNaN(prev)) return null;
    if (cur > prev) return 'up';
    if (cur < prev) return 'down';
    return null;
  };

  const PriceCard = ({ label, value, accent = false }) => (
    <div
      className={`rounded-xl border bg-white p-4 sm:p-5 text-center shadow-sm transition-shadow hover:shadow-md ${
        accent ? 'border-amber-200 ring-1 ring-amber-100' : 'border-slate-200'
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">{label}</p>
      <p className="text-xl sm:text-2xl font-semibold tabular-nums text-slate-900">{value}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-slate-300 border-t-amber-500 rounded-full animate-spin" />
        <p className="mt-4 text-slate-500 text-sm font-medium">Fiyatlar yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            {/* Logo + marka */}
            <div className="flex items-center justify-center sm:justify-start gap-3 sm:gap-4 text-center sm:text-left">
              <img
                src={logo}
                alt="Doğa Kuyumculuk"
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover ring-2 ring-amber-400/70 shadow-md"
              />
              <div className="flex flex-col">
                <h1 className="text-xl sm:text-2xl font-semibold tracking-tight leading-tight">
                  Doğa Kuyumculuk
                </h1>
                <p className="text-[11px] sm:text-xs text-amber-200/80 font-medium uppercase tracking-[0.18em]">
                  Altın & Döviz Fiyatları
                </p>
              </div>
            </div>

            {/* Sağ blok: buton + sosyal + adres */}
            <div className="flex flex-col items-stretch sm:items-end gap-2 w-full sm:w-auto">
              {/* Telefon butonu – mobilde geniş */}
              <a
                href={CONTACT.phoneLink}
                className="inline-flex justify-center items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-500/40 hover:bg-emerald-400 active:bg-emerald-600 transition-colors w-full sm:w-auto"
                aria-label={`Telefon: ${CONTACT.phone}`}
              >
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>{CONTACT.phone}</span>
              </a>

              {/* Sosyal linkler */}
              <div className="flex items-center justify-center sm:justify-end gap-3 text-xs sm:text-sm text-slate-300">
                <a
                  href={CONTACT.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <span>Instagram</span>
                </a>
                <span className="h-3 w-px bg-slate-600/70" />
                <a
                  href={CONTACT.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                  aria-label="TikTok"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                  <span>TikTok</span>
                </a>
              </div>

              <a
                href={CONTACT.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-300 hover:text-white transition-colors max-w-full sm:max-w-md"
                aria-label="Adres - haritada aç"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="truncate">
                  {CONTACT.addressLine1}, {CONTACT.addressLine2}
                </span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Uyarı */}
      <div className="bg-slate-100 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2">
          <p className="text-center text-slate-600 text-sm">
            Fiyatlar bilgilendirme amaçlıdır. Güncel fiyatlar için mağazamızı ziyaret ediniz.
          </p>
        </div>
      </div>

      {/* Ana içerik: sol galeri (sola yaslı) | merkez | sağ galeri (sağa yaslı) */}
      <main className="flex w-full max-w-[100vw] px-0 gap-0 py-4 sm:py-8 flex-1">
        <aside className="hidden lg:flex flex-shrink-0 w-64 xl:w-80 2xl:w-96 pl-2 xl:pl-4 flex flex-col items-stretch self-stretch min-h-0">
          <div className="flex-1 min-h-0 flex flex-col">
            <MediaSlideshow mediaList={galleryMedia} slideDuration={10000} startIndex={0} />
          </div>
        </aside>
        <div className="flex-1 min-w-0 max-w-5xl mx-auto px-4 sm:px-6">
      {prices && (
          <>
            {/* Öne çıkan fiyatlar */}
            <section className="grid grid-cols-2 sm:grid-cols-6 gap-3 sm:gap-4 mb-6">
              <PriceCard
                accent
                label="HAS Alış"
                value={prices.altin.HAS ? formatNumber(prices.altin.HAS.alis) : '—'}
              />
              <PriceCard
                accent
                label="HAS Satış"
                value={prices.altin.HAS ? formatNumber(prices.altin.HAS.satis) : '—'}
              />
              <PriceCard
                label="USD Alış"
                value={prices.doviz.USD ? formatNumber(prices.doviz.USD.alis) : '—'}
              />
              <PriceCard
                label="USD Satış"
                value={prices.doviz.USD ? formatNumber(prices.doviz.USD.satis) : '—'}
              />
              <PriceCard
                label="EUR Alış"
                value={prices.doviz.EUR ? formatNumber(prices.doviz.EUR.alis) : '—'}
              />
              <PriceCard
                label="EUR Satış"
                value={prices.doviz.EUR ? formatNumber(prices.doviz.EUR.satis) : '—'}
              />
            </section>

            {/* Tablo */}
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-800 text-white">
                      <th className="px-4 sm:px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">
                        Ürün
                      </th>
                      <th className="px-4 sm:px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider">
                        Alış (₺)
                      </th>
                      <th className="px-4 sm:px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider">
                        Satış (₺)
                      </th>
                      <th className="px-4 sm:px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">
                        Son güncelleme
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {['22_ayar_bilezik', 'hurda', 'yeni_ceyrek', 'yeni_yarim', 'yeni_ziynet', 'eski_ceyrek', 'eski_yarim', 'eski_ziynet', 'cnc', 'sarnel'].map(
                      (key) => {
                        const item = prices.altin[key];
                        if (!item) return null;
                        const change = getPriceChange(item, previousPrices?.altin?.[key]);
                        return (
                          <tr
                            key={key}
                            className="hover:bg-slate-50/80 transition-colors"
                          >
                            <td className="px-4 sm:px-6 py-3.5">
                              <span className="font-medium text-slate-800">{item.type}</span>
                            </td>
                            <td className="px-4 sm:px-6 py-3.5 text-right">
                              <span
                                className={`tabular-nums font-medium ${
                                  change === 'up'
                                    ? 'text-emerald-600'
                                    : change === 'down'
                                    ? 'text-red-600'
                                    : 'text-slate-900'
                                }`}
                              >
                                {formatNumber(item.alis)}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-3.5 text-right">
                              <span
                                className={`tabular-nums font-medium ${
                                  change === 'up'
                                    ? 'text-emerald-600'
                                    : change === 'down'
                                    ? 'text-red-600'
                                    : 'text-slate-900'
                                }`}
                              >
                                {formatNumber(item.satis)}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-3.5 text-right text-slate-500 text-sm hidden sm:table-cell">
                              {item.time || formatTime(prices.timestamp)}
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Mobil: tablonun altında galeri (lg ve üzerinde gizli) */}
            {galleryMedia.length > 0 && (
              <section className="lg:hidden mt-6 px-0">
                <div className="rounded-2xl overflow-hidden border border-amber-300/60 bg-slate-900 shadow-xl aspect-[3/4] max-h-[70vh] w-full mx-auto flex flex-col min-h-0">
                  <MediaSlideshow mediaList={galleryMedia} slideDuration={10000} startIndex={0} />
                </div>
              </section>
            )}
          </>
        )}
        </div>
        <aside className="hidden lg:flex flex-shrink-0 w-64 xl:w-80 2xl:w-96 pr-2 xl:pr-4 flex flex-col items-stretch self-stretch min-h-0">
          <div className="flex-1 min-h-0 flex flex-col">
            <MediaSlideshow mediaList={galleryMedia} slideDuration={10000} startIndex={Math.floor(galleryMedia.length / 2)} />
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-slate-800 text-slate-400 py-5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-1">
          <p className="text-sm">© {new Date().getFullYear()} Doğa Kuyumculuk</p>
          <p className="text-xs font-medium">
            <a
              href="https://www.linkedin.com/in/yuzgulfatih"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-amber-300 transition-colors"
            >
              Muhammed Fatih Yüzgül
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
