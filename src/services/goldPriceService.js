// Altın ve Döviz fiyat servisi
// Güneş Kuyumcusu API kullanılıyor
// https://www.guneskuyumcusu.com.tr/Info/GetProductInfo

// Geliştirme için proxy kullan, production için direkt URL
const API_URL = import.meta.env.DEV 
  ? '/api/Info/GetProductInfo'
  : 'https://www.guneskuyumcusu.com.tr/Info/GetProductInfo';

// ID eşleştirmeleri
const ID_MAP = {
  1: 'USD',
  2: 'EURO',
  3: 'HAS_ALTIN',
  7: 'YENI_TAM',
  8: 'ESKI_TAM',
  150: 'YENI_CEYREK',
  151: 'ESKI_CEYREK',
  152: 'YENI_YARIM',
  153: 'ESKI_YARIM',
  164: 'AYAR_22',
  169: 'GUMUS',
  // Ek ID'ler (gerekirse kullanılabilir)
  // 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 165, 166, 167
};

// String fiyatı sayıya çevir (virgülü noktaya çevir)
const parsePrice = (priceStr) => {
  if (!priceStr) return 0;
  // Virgülü noktaya çevir ve parse et
  return parseFloat(priceStr.replace(',', '.'));
};

// API'den tüm fiyatları çek
export const getAllPrices = async () => {
  try {
    // POST isteği gönder - timestamp ile cache bypass
    const timestamp = Date.now();
    // Proxy kullanıyorsak mode'u kaldır, değilse cors kullan
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({}), // Boş body gönder
    };
    
    // Sadece production'da mode: 'cors' ekle
    if (!import.meta.env.DEV) {
      fetchOptions.mode = 'cors';
    }
    
    const response = await fetch(`${API_URL}?_=${timestamp}`, fetchOptions);
    
    if (!response.ok) {
      console.error('API yanıt hatası:', response.status, response.statusText);
      throw new Error(`API hatası: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API yanıtı:', data); // Debug için
    
    // Array formatında geliyor, ID'ye göre eşleştir
    const prices = {
      doviz: {},
      altin: {},
      gumus: {},
      timestamp: new Date(),
    };
    
    // Her bir item'ı işle
    if (Array.isArray(data) && data.length > 0) {
      data.forEach((item) => {
        const id = item.id;
        const type = ID_MAP[id];
        
        if (!type) {
          console.log('Bilinmeyen ID:', id, item);
          return; // Bilinmeyen ID'yi atla
        }
        
        const priceData = {
          alis: parsePrice(item.purchasePrice),
          satis: parsePrice(item.salePrice),
          time: item.time || null,
        };
        
        // Döviz
        if (type === 'USD' || type === 'EURO') {
          prices.doviz[type] = priceData;
        }
        // Altın
        else if (type === 'HAS_ALTIN' || type === 'YENI_TAM' || type === 'ESKI_TAM' || 
                 type === 'YENI_YARIM' || type === 'ESKI_YARIM' || 
                 type === 'YENI_CEYREK' || type === 'ESKI_CEYREK' || type === 'AYAR_22') {
          prices.altin[type] = priceData;
        }
        // Gümüş
        else if (type === 'GUMUS') {
          prices.gumus[type] = priceData;
        }
      });
      
      console.log('İşlenmiş fiyatlar:', prices); // Debug için
      return prices;
    } else {
      console.warn('API boş array döndü veya array değil:', data);
      throw new Error('API boş veri döndü');
    }
  } catch (error) {
    console.error('API hatası:', error);
    console.error('Hata detayı:', error.message);
    // Hata durumunda mock data döndür
    console.warn('Mock data kullanılıyor');
    return getMockPrices();
  }
};

// Mock data (API başarısız olursa)
const getMockPrices = () => {
  const now = new Date();
  return {
    doviz: {
      USD: {
        alis: 43.39,
        satis: 43.534,
        time: now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      },
      EURO: {
        alis: 51.579,
        satis: 51.859,
        time: now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      },
    },
    altin: {
      HAS_ALTIN: {
        alis: 7394.52,
        satis: 7507.5,
        time: now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      },
      YENI_TAM: {
        alis: 48064,
        satis: 48942,
        time: now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      },
      ESKI_TAM: {
        alis: 47947,
        satis: 48819,
        time: now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      },
      YENI_YARIM: {
        alis: 24046,
        satis: 24560,
        time: now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      },
      ESKI_YARIM: {
        alis: 23973,
        satis: 24499,
        time: now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      },
      YENI_CEYREK: {
        alis: 12018,
        satis: 12320,
        time: now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      },
      ESKI_CEYREK: {
        alis: 11985,
        satis: 12305,
        time: now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      },
      AYAR_22: {
        alis: 6752.01,
        satis: 6899.27,
        time: now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      },
    },
    gumus: {
      GUMUS: {
        alis: 149.093,
        satis: 162.977,
        time: now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      },
    },
    timestamp: now,
  };
};
