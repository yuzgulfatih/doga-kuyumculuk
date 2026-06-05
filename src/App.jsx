import { useState, useEffect, useRef } from 'react';
import { getAllPrices } from './services/goldPriceService';
import logo from './assets/logo.jpg';

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

const ALTIN_HESAP_KEYS = [
  'HAS',
  '22_ayar_bilezik',
  'hurda',
  'yeni_ceyrek',
  'yeni_yarim',
  'yeni_ziynet',
  'eski_ceyrek',
  'eski_yarim',
  'eski_ziynet',
  'cnc',
  'sarnel',
];

const ALTIN_DISPLAY_NAMES = {
  HAS: '24 Ayar (Has)',
};

const getAltinDisplayName = (key, fallback) => ALTIN_DISPLAY_NAMES[key] || fallback;

const TABLE_KEYS = [
  'HAS',
  '22_ayar_bilezik',
  'hurda',
  'yeni_ceyrek',
  'yeni_yarim',
  'yeni_ziynet',
  'eski_ceyrek',
  'eski_yarim',
  'eski_ziynet',
  'cnc',
  'sarnel',
];

function OrnamentDivider({ className = '' }) {
  return (
    <div className={`flex items-center gap-4 ${className}`} aria-hidden>
      <div className="gold-divider flex-1" />
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gold shrink-0">
        <path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z" fill="currentColor" opacity="0.6" />
      </svg>
      <div className="gold-divider flex-1" />
    </div>
  );
}

function LiveIndicator() {
  return (
    <span className="live-badge">
      <span className="live-badge__dot">
        <span className="live-badge__ping" />
        <span className="live-badge__core" />
      </span>
      Canlı
    </span>
  );
}

function Navbar() {
  return (
    <>
      <nav className="site-navbar" aria-label="Ana menü">
        <div className="site-navbar__inner">
          <a href="#" className="site-navbar__brand">
            <div className="site-navbar__logo-wrap">
              <div className="site-navbar__logo-glow" aria-hidden />
              <img src={logo} alt="" className="site-navbar__logo" />
            </div>
            <div className="min-w-0">
              <span className="site-navbar__title">Doğa Kuyumculuk</span>
              <span className="site-navbar__tagline">Altın & Döviz Fiyatları</span>
            </div>
          </a>

          <div className="site-navbar__actions">
            <div className="site-navbar__social">
              <a
                href={CONTACT.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="site-navbar__social-link"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href={CONTACT.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="site-navbar__social-link"
                aria-label="TikTok"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
            </div>

            <a href={CONTACT.phoneLink} className="btn-gold-filled site-navbar__phone" aria-label={`Telefon: ${CONTACT.phone}`}>
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="site-navbar__phone-text">{CONTACT.phone}</span>
            </a>
          </div>
        </div>

        <div className="site-navbar__sub">
          <a
            href={CONTACT.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="site-navbar__address"
            aria-label="Adres - haritada aç"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>
              {CONTACT.addressLine1}, {CONTACT.addressLine2}
            </span>
          </a>
        </div>
      </nav>

      <div className="site-disclaimer">
        <div className="site-disclaimer__inner">
          Fiyatlar bilgilendirme amaçlıdır. Güncel fiyatlar için mağazamızı ziyaret ediniz.
        </div>
      </div>
    </>
  );
}

function CollectionGallery({ mediaList, slideDuration = 10000, startIndex = 0 }) {
  const [index, setIndex] = useState(startIndex % Math.max(1, mediaList.length));
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);

  const displayIndex = index % mediaList.length;
  const current = mediaList[displayIndex];
  const isFirst = displayIndex === 0;
  const currentIsVideo = isVideo(current);

  const goToNext = () => setIndex((i) => (i + 1) % mediaList.length);
  const goToPrev = () => setIndex((i) => (i - 1 + mediaList.length) % mediaList.length);
  const goToSlide = (i) => setIndex(i);

  useEffect(() => {
    setProgress(0);
    if (currentIsVideo) return;

    const start = performance.now();
    let frame;

    const tick = (now) => {
      const elapsed = now - start;
      setProgress(Math.min((elapsed / slideDuration) * 100, 100));
      if (elapsed < slideDuration) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    const t = setTimeout(goToNext, slideDuration);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(t);
    };
  }, [displayIndex, currentIsVideo, mediaList.length, slideDuration]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !currentIsVideo) return;
    v.muted = true;
    v.volume = 0;

    const onTimeUpdate = () => {
      if (v.duration) setProgress((v.currentTime / v.duration) * 100);
    };

    v.addEventListener('timeupdate', onTimeUpdate);
    v.play().catch(goToNext);
    return () => v.removeEventListener('timeupdate', onTimeUpdate);
  }, [displayIndex, current]);

  if (!mediaList.length) return null;

  return (
    <div className="collection-panel">
      <div className="collection-panel__header">
        <div className="collection-panel__header-text">
          <span className="collection-panel__eyebrow">Galeri</span>
          <span className="collection-panel__title">Koleksiyonumuz</span>
        </div>
        <span className="collection-panel__counter">
          {String(displayIndex + 1).padStart(2, '0')} / {String(mediaList.length).padStart(2, '0')}
        </span>
      </div>

      <div className="collection-frame">
        <div className="collection-frame__corner collection-frame__corner--tl" aria-hidden />
        <div className="collection-frame__corner collection-frame__corner--tr" aria-hidden />
        <div className="collection-frame__corner collection-frame__corner--bl" aria-hidden />
        <div className="collection-frame__corner collection-frame__corner--br" aria-hidden />

        <div className="collection-slideshow">
          <div className="collection-slideshow__progress" aria-hidden>
            <div className="collection-slideshow__progress-bar" style={{ width: `${progress}%` }} />
          </div>

          <div className="collection-slideshow__media">
            <div key={displayIndex} className="collection-slideshow__slide slide-fade-in">
              {currentIsVideo ? (
                <video
                  ref={videoRef}
                  src={current}
                  className="collection-slideshow__asset"
                  muted
                  playsInline
                  preload={isFirst ? 'metadata' : 'none'}
                  onEnded={goToNext}
                  onError={goToNext}
                />
              ) : (
                <img
                  src={current}
                  alt="Doğa Kuyumculuk koleksiyonu"
                  className="collection-slideshow__asset"
                  loading={isFirst ? 'eager' : 'lazy'}
                  fetchPriority={isFirst ? 'high' : 'auto'}
                  onError={goToNext}
                />
              )}
            </div>
          </div>

          <div className="collection-slideshow__overlay" aria-hidden />

          <button
            type="button"
            className="collection-slideshow__nav collection-slideshow__nav--prev"
            onClick={goToPrev}
            aria-label="Önceki görsel"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            className="collection-slideshow__nav collection-slideshow__nav--next"
            onClick={goToNext}
            aria-label="Sonraki görsel"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="collection-dots" role="tablist" aria-label="Galeri görselleri">
          {mediaList.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === displayIndex}
              aria-label={`Görsel ${i + 1}`}
              className={`collection-dots__dot ${i === displayIndex ? 'collection-dots__dot--active' : ''}`}
              onClick={() => goToSlide(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function AltinTutarHesap({ prices, formatNumber, hesapMiktar, setHesapMiktar, hesapTurKey, setHesapTurKey }) {
  const mevcutKeys = ALTIN_HESAP_KEYS.filter((k) => prices.altin[k]);
  if (mevcutKeys.length === 0) return null;
  const turKey = mevcutKeys.includes(hesapTurKey) ? hesapTurKey : mevcutKeys[0];
  const secilen = turKey ? prices.altin[turKey] : null;
  const miktar = parseFloat(String(hesapMiktar).replace(',', '.'));
  const miktarGecerli = Number.isFinite(miktar) && miktar >= 0;
  const alisToplam = miktarGecerli && secilen ? miktar * secilen.alis : null;
  const satisToplam = miktarGecerli && secilen ? miktar * secilen.satis : null;

  return (
    <section id="hesaplama" className="mb-8 scroll-mt-32 overflow-hidden rounded-sm border border-gold/25 bg-charcoal shadow-gold-lg">
      <div className="border-b border-gold/20 bg-charcoal-light px-5 py-4 sm:px-6">
        <p className="section-subtitle mb-1 text-gold-light/70">Hesaplama</p>
        <h2 className="section-heading section-heading--light">Altın Tutarı Hesaplama</h2>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-end">
          <label className="flex min-w-[7rem] flex-1 flex-col gap-2 sm:max-w-[11rem]">
            <span className="text-xs font-medium text-gold-light/60">Miktar</span>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              step="any"
              value={hesapMiktar}
              onChange={(e) => setHesapMiktar(e.target.value)}
              className="luxury-input border-gold/20 bg-charcoal-light text-ivory focus:border-gold focus:ring-gold/20"
              placeholder="1"
              aria-label="Miktar (HAS için gram, ziynet için adet)"
            />
          </label>

          <label className="flex min-w-0 flex-1 flex-col gap-2 sm:min-w-[14rem] sm:max-w-md">
            <span className="text-xs font-medium text-gold-light/60">Tür</span>
            <select
              value={turKey || ''}
              onChange={(e) => setHesapTurKey(e.target.value)}
              className="luxury-select border-gold/20 bg-charcoal-light text-ivory focus:border-gold focus:ring-gold/20"
              aria-label="Altın türü"
            >
              {mevcutKeys.map((k) => (
                <option key={k} value={k} className="bg-charcoal text-ivory">
                  {getAltinDisplayName(k, prices.altin[k].type)}
                </option>
              ))}
            </select>
          </label>

          <div className="min-w-0 flex-1 rounded-sm border border-gold/20 bg-charcoal-light/60 px-5 py-4 sm:min-w-[16rem]">
            <p className="mb-3 text-xs font-medium text-gold-light/50">
              Tahmini Tutar
            </p>
            {!secilen || !miktarGecerli ? (
              <p className="text-sm text-gold-light/40">Geçerli bir miktar girin.</p>
            ) : (
              <ul className="space-y-3">
                <li className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <span className="text-sm text-gold-light/60">Kuyumcuya satarken</span>
                  <span className="price-value text-ivory">
                    {formatNumber(alisToplam)} <span className="text-sm font-medium text-gold">₺</span>
                  </span>
                </li>
                <li className="gold-divider" />
                <li className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <span className="text-sm text-gold-light/60">Kuyumcudan alırken</span>
                  <span className="price-value text-gold-light">
                    {formatNumber(satisToplam)} <span className="text-sm font-medium text-gold">₺</span>
                  </span>
                </li>
              </ul>
            )}
          </div>
        </div>

        <p className="mt-5 text-xs leading-relaxed text-gold-light/40">
          HAS için miktar <strong className="font-medium text-gold-light/60">gram</strong>; çeyrek, yarım, bilezik vb. için{' '}
          <strong className="font-medium text-gold-light/60">adet</strong> girin. Kesin işlem için mağazamızı arayın.
        </p>
      </div>
    </section>
  );
}

function PriceCard({ label, value, featured = false, currency = false }) {
  if (featured) {
    return (
      <div className="group relative overflow-hidden rounded-sm border border-gold/40 bg-charcoal p-4 text-center shadow-gold transition-all duration-300 hover:border-gold/60 hover:shadow-gold-lg sm:p-5">
        <div className="absolute inset-0 bg-gold-gradient opacity-[0.04] transition-opacity group-hover:opacity-[0.08]" />
        <p className="relative mb-2 text-xs font-medium text-gold-light/70">{label}</p>
        <p className="relative price-value price-value--featured">
          {value}
        </p>
        <div className="absolute bottom-0 left-1/2 h-px w-12 -translate-x-1/2 bg-gold/50" />
      </div>
    );
  }

  return (
    <div className="luxury-card group rounded-sm p-4 text-center transition-all duration-300 hover:border-gold/35 hover:shadow-gold sm:p-5">
      <p className="mb-2 text-xs font-medium text-bronze">{label}</p>
      <p className="price-value text-charcoal">
        {value}
        {currency && <span className="ml-0.5 text-sm font-medium text-bronze">₺</span>}
      </p>
    </div>
  );
}

function App() {
  const [prices, setPrices] = useState(null);
  const [previousPrices, setPreviousPrices] = useState(null);
  const [loading, setLoading] = useState(true);
  const pricesRef = useRef(null);
  const [hesapMiktar, setHesapMiktar] = useState('1');
  const [hesapTurKey, setHesapTurKey] = useState('yeni_ceyrek');

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
    if (num === null || num === undefined) return '—';
    const n = Number(num);
    if (Number.isNaN(n)) return '—';
    return n.toLocaleString('tr-TR', {
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

  const getPriceChange = (currentPrice, previousPrice) => {
    if (!previousPrice?.alis || !currentPrice?.alis) return null;
    const cur = parseFloat(currentPrice.alis);
    const prev = parseFloat(previousPrice.alis);
    if (isNaN(cur) || isNaN(prev)) return null;
    if (cur > prev) return 'up';
    if (cur < prev) return 'down';
    return null;
  };

  const priceChangeClass = (change) => {
    if (change === 'up') return 'text-emerald-500';
    if (change === 'down') return 'text-red-400';
    return 'text-charcoal';
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-ivory bg-ivory-texture">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border border-gold/30" />
          <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-2 border-transparent border-t-gold" />
        </div>
        <p className="mt-8 text-base font-medium text-charcoal/70">Fiyatlar yükleniyor</p>
        <p className="mt-1 font-display text-sm font-semibold text-gold-dark">Doğa Kuyumculuk</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-ivory bg-ivory-texture">
      <Navbar />

      {/* Main */}
      <main className="page-main">
        <div className="page-main__content">
          {prices && (
            <>
              {/* Section header */}
              <div id="fiyatlar" className="section-hero mb-6 animate-slide-up sm:mb-8 scroll-mt-32">
                <p className="section-subtitle">Güncel Kurlar</p>
                <h2 className="section-title">Bugünün Fiyatları</h2>
                <div className="section-hero__live">
                  <LiveIndicator />
                </div>
                {prices.timestamp && (
                  <p className="section-hero__updated">
                    Son güncelleme: {formatTime(prices.timestamp)}
                  </p>
                )}
              </div>

              <OrnamentDivider className="mb-6 sm:mb-8" />

              {/* Featured prices */}
              <section className="price-highlight mb-8">
                <div className="price-highlight__has grid grid-cols-2 gap-3 sm:gap-4">
                <PriceCard
                  featured
                  label="HAS Alış"
                  value={prices.altin.HAS ? formatNumber(prices.altin.HAS.alis) : '—'}
                />
                <PriceCard
                  featured
                  label="HAS Satış"
                  value={prices.altin.HAS ? formatNumber(prices.altin.HAS.satis) : '—'}
                />
                </div>
                <div className="price-highlight__fx grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                <PriceCard
                  label="USD Alış"
                  value={prices.doviz.USD ? formatNumber(prices.doviz.USD.alis) : '—'}
                  currency
                />
                <PriceCard
                  label="USD Satış"
                  value={prices.doviz.USD ? formatNumber(prices.doviz.USD.satis) : '—'}
                  currency
                />
                <PriceCard
                  label="EUR Alış"
                  value={prices.doviz.EUR ? formatNumber(prices.doviz.EUR.alis) : '—'}
                  currency
                />
                <PriceCard
                  label="EUR Satış"
                  value={prices.doviz.EUR ? formatNumber(prices.doviz.EUR.satis) : '—'}
                  currency
                />
                </div>
              </section>

              <AltinTutarHesap
                prices={prices}
                formatNumber={formatNumber}
                hesapMiktar={hesapMiktar}
                setHesapMiktar={setHesapMiktar}
                hesapTurKey={hesapTurKey}
                setHesapTurKey={setHesapTurKey}
              />

              {/* Price table */}
              <section className="overflow-hidden rounded-sm border border-gold/20 bg-ivory-warm shadow-luxury">
                <div className="border-b border-gold/15 px-5 py-4 sm:px-6">
                  <p className="section-subtitle mb-1">Detaylı Liste</p>
                  <h2 className="section-heading">Altın Fiyatları</h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gold/15 bg-ivory-dark/60">
                        <th className="px-5 py-3.5 text-left text-xs font-semibold text-bronze sm:px-6">
                          Ürün
                        </th>
                        <th className="px-5 py-3.5 text-right text-xs font-semibold text-bronze sm:px-6">
                          Alış (₺)
                        </th>
                        <th className="px-5 py-3.5 text-right text-xs font-semibold text-bronze sm:px-6">
                          Satış (₺)
                        </th>
                        <th className="hidden px-5 py-3.5 text-right text-xs font-semibold text-bronze sm:table-cell sm:px-6">
                          Güncelleme
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {TABLE_KEYS.map((key, idx) => {
                        const item = prices.altin[key];
                        if (!item) return null;
                        const change = getPriceChange(item, previousPrices?.altin?.[key]);
                        return (
                          <tr
                            key={key}
                            className={`border-b border-gold/8 transition-colors hover:bg-champagne/30 ${
                              idx % 2 === 0 ? 'bg-transparent' : 'bg-ivory-dark/30'
                            }`}
                          >
                            <td className="px-5 py-4 sm:px-6">
                              <span className="font-medium text-charcoal">{getAltinDisplayName(key, item.type)}</span>
                            </td>
                            <td className="px-5 py-4 text-right sm:px-6">
                              <span className={`price-value price-value--table ${priceChangeClass(change)}`}>
                                {formatNumber(item.alis)}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-right sm:px-6">
                              <span className={`price-value price-value--table ${priceChangeClass(change)}`}>
                                {formatNumber(item.satis)}
                              </span>
                            </td>
                            <td className="hidden px-5 py-4 text-right text-xs text-bronze sm:table-cell sm:px-6">
                              {item.time || formatTime(prices.timestamp)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>

              {galleryMedia.length > 0 && (
                <section className="page-collection">
                  <CollectionGallery mediaList={galleryMedia} slideDuration={10000} startIndex={0} />
                </section>
              )}
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-gold/20 bg-charcoal">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="mb-8 grid gap-8 sm:grid-cols-3">
            <div className="text-center sm:text-left">
              <h3 className="font-display text-lg font-semibold text-ivory">Doğa Kuyumculuk</h3>
              <p className="mt-2 text-sm leading-relaxed text-gold-light/50">
                Şanlıurfa'nın güvenilir kuyumcusu. Altın, ziynet ve döviz işlemlerinizde yanınızdayız.
              </p>
            </div>

            <div className="text-center">
              <h3 className="mb-3 text-sm font-semibold text-gold-light/70">İletişim</h3>
              <div className="space-y-2 text-sm text-gold-light/50">
                <a href={CONTACT.phoneLink} className="block transition-colors hover:text-gold-light">
                  {CONTACT.phone}
                </a>
                <a
                  href={CONTACT.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block transition-colors hover:text-gold-light"
                >
                  Haliliye, Şanlıurfa
                </a>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <h3 className="mb-3 text-sm font-semibold text-gold-light/70">Sosyal Medya</h3>
              <div className="flex justify-center gap-3 sm:justify-end">
                <a
                  href={CONTACT.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold px-4 py-2 text-xs"
                  aria-label="Instagram"
                >
                  Instagram
                </a>
                <a
                  href={CONTACT.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold px-4 py-2 text-xs"
                  aria-label="TikTok"
                >
                  TikTok
                </a>
              </div>
            </div>
          </div>

          <OrnamentDivider className="mb-6" />

          <div className="text-center space-y-1">
            <p className="text-xs text-gold-light/30">
              © {new Date().getFullYear()} Doğa Kuyumculuk. Tüm hakları saklıdır.
            </p>
            <p className="text-[11px] text-gold-light/20">
              <a
                href="https://www.linkedin.com/in/yuzgulfatih"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-gold-light/50"
              >
                Muhammed Fatih Yüzgül
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
