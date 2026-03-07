// Altın ve Döviz fiyat servisi
// Sukob Fiyat API: https://sukobfiyat.com/api/prices
// Fiyatlar yaklaşık 30 saniyede bir güncellenir

const API_URL = import.meta.env.DEV ? '/api/prices' : '/api/getPrices';

const DOVIZ_URLS = new Set(['USD', 'EUR']);

const formatLastUpdate = (lastUpdate) => {
  if (!lastUpdate) return null;
  const parts = lastUpdate.trim().split(/\s+/);
  if (parts.length >= 2) return parts[1];
  return lastUpdate;
};

export const getAllPrices = async () => {
  try {
    const response = await fetch(`${API_URL}?_=${Date.now()}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      mode: 'cors',
      credentials: 'omit',
    });

    if (!response.ok) throw new Error(`API hatası: ${response.status}`);

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) throw new Error('API boş veri döndü');

    const prices = { doviz: {}, altin: {}, timestamp: new Date() };

    data.forEach((item) => {
      const url = (item.url || '').trim();
      if (!url) return;

      const priceData = {
        alis: Number(item.buyPrice) || 0,
        satis: Number(item.sellPrice) || 0,
        time: formatLastUpdate(item.lastUpdate),
        type: item.type || url,
      };

      if (DOVIZ_URLS.has(url)) {
        prices.doviz[url] = priceData;
      } else {
        prices.altin[url] = priceData;
      }
    });

    return prices;
  } catch (error) {
    console.error('API hatası:', error);
    return getMockPrices();
  }
};

const getMockPrices = () => {
  const now = new Date();
  const t = () => now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  return {
    doviz: {
      USD: { alis: 44.11, satis: 44.18, time: t(), type: 'USD' },
      EUR: { alis: 51.166, satis: 51.354, time: t(), type: 'EUR' },
    },
    altin: {
      HAS: { alis: 7457.67, satis: 7489.64, time: t(), type: 'HAS' },
      '22_ayar_bilezik': { alis: 6797.67, satis: 6927.92, time: t(), type: '22 Ayar Bilezik' },
      hurda: { alis: 6797.67, satis: 6860.51, time: t(), type: '22 Ayar Hurda' },
      yeni_ceyrek: { alis: 12118.71, satis: 12395.35, time: t(), type: 'Yeni Çeyrek' },
      yeni_yarim: { alis: 24237.43, satis: 24715.81, time: t(), type: 'Yeni Yarım' },
      yeni_ziynet: { alis: 48624, satis: 49206.93, time: t(), type: 'Yeni Ziynet' },
      eski_ceyrek: { alis: 12006.85, satis: 12283.01, time: t(), type: 'Eski Çeyrek' },
      eski_yarim: { alis: 24013.7, satis: 24528.57, time: t(), type: 'Eski Yarım' },
      eski_ziynet: { alis: 48251.12, satis: 48832.45, time: t(), type: 'Eski Ziynet' },
      cnc: { alis: 6801.4, satis: 6972.85, time: t(), type: 'CNC' },
      sarnel: { alis: 6801.4, satis: 6987.83, time: t(), type: 'ŞARNEL' },
    },
    timestamp: now,
  };
};
