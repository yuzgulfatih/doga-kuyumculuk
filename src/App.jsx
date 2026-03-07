import { useState, useEffect, useRef } from 'react';
import { getAllPrices } from './services/goldPriceService';
import logo from './assets/logo.jpg';

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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-800 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <img
              src={logo}
              alt="Doğa Kuyumculuk"
              className="w-14 h-14 rounded-full object-cover ring-2 ring-amber-400/50"
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Doğa Kuyumculuk</h1>
              <p className="text-slate-400 text-sm mt-0.5">Altın ve döviz fiyatları</p>
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

      {/* Ana içerik */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
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
              <div className="px-4 sm:px-6 py-2 bg-slate-50 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Güncelleme: {formatDate(prices.timestamp)} — Fiyatlar yaklaşık 30 saniyede bir yenilenir.
                </p>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-slate-800 text-slate-400 py-5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm">© {new Date().getFullYear()} Doğa Kuyumculuk</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
