import { useState, useEffect, useRef } from 'react';
import { getAllPrices } from './services/goldPriceService';
import logo from './assets/logo.jpg';

function App() {
  const [prices, setPrices] = useState(null);
  const [previousPrices, setPreviousPrices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const pricesRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllPrices();
        // Önceki fiyatları sakla (yeni veri gelmeden önce)
        if (pricesRef.current) {
          setPreviousPrices(pricesRef.current);
        }
        // Yeni fiyatları hem state'e hem de ref'e kaydet
        pricesRef.current = data;
        setPrices(data);
      } catch (error) {
        console.error('Veri çekme hatası:', error);
      } finally {
        setLoading(false);
      }
    };

    // İlk yükleme
    fetchData();

    // Her 3 saniyede bir güncelle (anlık güncelleme)
    const interval = setInterval(fetchData, 3000);
    
    // Her saniye tarih/saat güncelle
    const timeInterval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timeInterval);
    };
  }, []);

  const formatNumber = (num) => {
    if (!num) return '0,00';
    return num.toLocaleString('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatDateTime = (date) => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
  };

  const formatTime = (date) => {
    if (!date) return '';
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const formatDate = (date) => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // Fiyat değişimini kontrol et ve renk döndür
  const getPriceChangeColor = (currentPrice, previousPrice, type = 'text') => {
    if (!previousPrice || !currentPrice) {
      // İlk yükleme veya veri yoksa nötr renk
      return type === 'bg' 
        ? 'bg-white hover:bg-amber-50' 
        : 'text-gray-900';
    }

    const current = parseFloat(currentPrice.alis || currentPrice);
    const previous = parseFloat(previousPrice.alis || previousPrice);

    if (isNaN(current) || isNaN(previous)) {
      // Geçersiz değer varsa nötr renk
      return type === 'bg' 
        ? 'bg-white hover:bg-amber-50' 
        : 'text-gray-900';
    }

    if (current > previous) {
      // Yükseliş - Yeşil
      return type === 'bg' 
        ? 'bg-green-50 hover:bg-green-100 border-green-500' 
        : 'text-green-700';
    } else if (current < previous) {
      // Düşüş - Kırmızı
      return type === 'bg' 
        ? 'bg-red-50 hover:bg-red-100 border-red-500' 
        : 'text-red-700';
    } else {
      // Değişim yok - Nötr renk
      return type === 'bg' 
        ? 'bg-white hover:bg-amber-50' 
        : 'text-gray-900';
    }
  };

  // Fiyat değişim okunu döndür
  const getPriceChangeArrow = (currentPrice, previousPrice) => {
    if (!previousPrice || !currentPrice) {
      return null;
    }

    const current = parseFloat(currentPrice.alis || currentPrice);
    const previous = parseFloat(previousPrice.alis || previousPrice);

    if (isNaN(current) || isNaN(previous)) {
      return null;
    }

    if (current > previous) {
      // Yükseliş - Yukarı ok
      return (
        <svg className="inline-block w-4 h-4 ml-1 text-green-700" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
      );
    } else if (current < previous) {
      // Düşüş - Aşağı ok
      return (
        <svg className="inline-block w-4 h-4 ml-1 text-red-700" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      {/* Üst Header - Lüks Tasarım */}
      <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 shadow-2xl">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
            <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto justify-center sm:justify-start">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-1.5 sm:p-2 shadow-lg flex-shrink-0">
                <img 
                  src={logo} 
                  alt="Doğa Kuyumculuk Logo" 
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
                />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-wide">Doğa Kuyumculuk</h1>
                <p className="text-amber-100 text-xs sm:text-sm hidden sm:block">Anlık Altın ve Döviz Fiyatları</p>
              </div>
            </div>
            <div className="text-center sm:text-right w-full sm:w-auto">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 inline-block">
                <p className="text-white font-semibold text-sm sm:text-base md:text-lg">{formatDateTime(currentDateTime)}</p>
                <p className="text-amber-100 text-xs hidden sm:block">Canlı Güncelleme</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bilgilendirme Banner */}
      <div className="bg-blue-600 text-white py-2 shadow-md">
        <div className="container mx-auto px-6">
          <p className="text-center text-sm font-medium">
            ⚠️ Fiyatlar bilgilendirme amaçlıdır. Güncel fiyatlar için lütfen mağazamızı ziyaret ediniz.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Ana Başlık */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-amber-900 mb-2 tracking-tight">
            Döviz ve Altın Fiyatları
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-yellow-400 mx-auto rounded-full"></div>
        </div>

        {/* Tablo Container */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-amber-400 border-t-transparent"></div>
            <p className="mt-6 text-amber-700 text-lg font-medium">Fiyatlar yükleniyor...</p>
          </div>
        ) : prices ? (
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-amber-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-amber-600 to-yellow-600">
                    <th className="px-8 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                      Döviz/Altın
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                      <span className="border-b-2 border-white pb-1">ALIŞ (₺)</span>
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                      <span className="border-b-2 border-white pb-1">SATIŞ (₺)</span>
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                      <span className="border-b-2 border-white pb-1">{formatDate(prices.timestamp)}</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100">
                  {/* USD/TL */}
                  {prices.doviz.USD && (() => {
                    const bgClass = getPriceChangeColor(prices.doviz.USD, previousPrices?.doviz?.USD, 'bg');
                    const textClass = getPriceChangeColor(prices.doviz.USD, previousPrices?.doviz?.USD, 'text');
                    const borderClass = bgClass.includes('green') ? 'border-green-500' : bgClass.includes('red') ? 'border-red-500' : '';
                    return (
                      <tr className={`${bgClass} transition-all duration-200 ${borderClass ? `border-l-4 ${borderClass}` : ''}`}>
                        <td className="px-3 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                              <span className="text-blue-600 font-bold text-xs sm:text-sm">$</span>
                            </div>
                            <span className={`text-sm sm:text-base font-semibold ${textClass}`}>USD/TL</span>
                          </div>
                        </td>
                        <td className={`px-3 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base font-semibold ${textClass}`}>
                          <div className="flex items-center">
                            {formatNumber(prices.doviz.USD.alis)}
                            {getPriceChangeArrow(prices.doviz.USD, previousPrices?.doviz?.USD)}
                          </div>
                        </td>
                        <td className={`px-3 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base font-semibold ${textClass}`}>
                          <div className="flex items-center">
                            {formatNumber(prices.doviz.USD.satis)}
                            {getPriceChangeArrow(prices.doviz.USD, previousPrices?.doviz?.USD)}
                          </div>
                        </td>
                        <td className={`px-3 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap text-xs sm:text-sm ${textClass} hidden sm:table-cell`}>
                          {prices.doviz.USD.time || formatTime(prices.timestamp)}
                        </td>
                      </tr>
                    );
                  })()}

                  {/* EURO/TL */}
                  {prices.doviz.EURO && (() => {
                    const bgClass = getPriceChangeColor(prices.doviz.EURO, previousPrices?.doviz?.EURO, 'bg');
                    const textClass = getPriceChangeColor(prices.doviz.EURO, previousPrices?.doviz?.EURO, 'text');
                    const borderClass = bgClass.includes('green') ? 'border-green-500' : bgClass.includes('red') ? 'border-red-500' : '';
                    return (
                      <tr className={`${bgClass} transition-all duration-200 ${borderClass ? `border-l-4 ${borderClass}` : ''}`}>
                        <td className="px-3 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                              <span className="text-blue-600 font-bold text-xs sm:text-sm">€</span>
                            </div>
                            <span className={`text-sm sm:text-base font-semibold ${textClass}`}>EURO/TL</span>
                          </div>
                        </td>
                        <td className={`px-3 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base font-semibold ${textClass}`}>
                          <div className="flex items-center">
                            {formatNumber(prices.doviz.EURO.alis)}
                            {getPriceChangeArrow(prices.doviz.EURO, previousPrices?.doviz?.EURO)}
                          </div>
                        </td>
                        <td className={`px-3 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base font-semibold ${textClass}`}>
                          <div className="flex items-center">
                            {formatNumber(prices.doviz.EURO.satis)}
                            {getPriceChangeArrow(prices.doviz.EURO, previousPrices?.doviz?.EURO)}
                          </div>
                        </td>
                        <td className={`px-3 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap text-xs sm:text-sm ${textClass} hidden sm:table-cell`}>
                          {prices.doviz.EURO.time || formatTime(prices.timestamp)}
                        </td>
                      </tr>
                    );
                  })()}

                  {/* HAS ALTIN */}
                  {prices.altin.HAS_ALTIN && (() => {
                    const bgClass = getPriceChangeColor(prices.altin.HAS_ALTIN, previousPrices?.altin?.HAS_ALTIN, 'bg');
                    const textClass = getPriceChangeColor(prices.altin.HAS_ALTIN, previousPrices?.altin?.HAS_ALTIN, 'text');
                    const borderClass = bgClass.includes('green') ? 'border-green-500' : bgClass.includes('red') ? 'border-red-500' : '';
                    return (
                      <tr className={`${bgClass} transition-all duration-200 ${borderClass ? `border-l-4 ${borderClass}` : ''}`}>
                        <td className="px-3 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mr-2 sm:mr-3 shadow-md flex-shrink-0">
                              <span className="text-white font-bold text-xs">Au</span>
                            </div>
                            <span className={`text-sm sm:text-base font-bold ${textClass}`}>HAS ALTIN/TL</span>
                          </div>
                        </td>
                        <td className={`px-3 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base font-bold ${textClass}`}>
                          <div className="flex items-center">
                            {formatNumber(prices.altin.HAS_ALTIN.alis)}
                            {getPriceChangeArrow(prices.altin.HAS_ALTIN, previousPrices?.altin?.HAS_ALTIN)}
                          </div>
                        </td>
                        <td className={`px-3 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base font-bold ${textClass}`}>
                          <div className="flex items-center">
                            {formatNumber(prices.altin.HAS_ALTIN.satis)}
                            {getPriceChangeArrow(prices.altin.HAS_ALTIN, previousPrices?.altin?.HAS_ALTIN)}
                          </div>
                        </td>
                        <td className={`px-3 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap text-xs sm:text-sm ${textClass} font-medium hidden sm:table-cell`}>
                          {prices.altin.HAS_ALTIN.time || formatTime(prices.timestamp)}
                        </td>
                      </tr>
                    );
                  })()}

                  {/* YENİ TAM */}
                  {prices.altin.YENI_TAM && (() => {
                    const bgClass = getPriceChangeColor(prices.altin.YENI_TAM, previousPrices?.altin?.YENI_TAM, 'bg');
                    const textClass = getPriceChangeColor(prices.altin.YENI_TAM, previousPrices?.altin?.YENI_TAM, 'text');
                    const borderClass = bgClass.includes('green') ? 'border-green-500' : bgClass.includes('red') ? 'border-red-500' : '';
                    return (
                      <tr className={`${bgClass} transition-all duration-200 ${borderClass ? `border-l-4 ${borderClass}` : ''}`}>
                        <td className="px-3 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mr-2 sm:mr-3 shadow-md flex-shrink-0">
                              <span className="text-white font-bold text-xs">★</span>
                            </div>
                            <span className={`text-sm sm:text-base font-bold ${textClass}`}>YENİ TAM/TL</span>
                          </div>
                        </td>
                        <td className={`px-3 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base font-bold ${textClass}`}>
                          <div className="flex items-center">
                            {formatNumber(prices.altin.YENI_TAM.alis)}
                            {getPriceChangeArrow(prices.altin.YENI_TAM, previousPrices?.altin?.YENI_TAM)}
                          </div>
                        </td>
                        <td className={`px-3 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base font-bold ${textClass}`}>
                          <div className="flex items-center">
                            {formatNumber(prices.altin.YENI_TAM.satis)}
                            {getPriceChangeArrow(prices.altin.YENI_TAM, previousPrices?.altin?.YENI_TAM)}
                          </div>
                        </td>
                        <td className={`px-3 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap text-xs sm:text-sm ${textClass} font-medium hidden sm:table-cell`}>
                          {prices.altin.YENI_TAM.time || formatTime(prices.timestamp)}
                        </td>
                      </tr>
                    );
                  })()}

                  {/* ESKİ TAM */}
                  {prices.altin.ESKI_TAM && (() => {
                    const bgClass = getPriceChangeColor(prices.altin.ESKI_TAM, previousPrices?.altin?.ESKI_TAM, 'bg');
                    const textClass = getPriceChangeColor(prices.altin.ESKI_TAM, previousPrices?.altin?.ESKI_TAM, 'text');
                    const borderClass = bgClass.includes('green') ? 'border-green-500' : bgClass.includes('red') ? 'border-red-500' : '';
                    return (
                      <tr className={`${bgClass} transition-all duration-200 ${borderClass ? `border-l-4 ${borderClass}` : ''}`}>
                        <td className="px-3 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mr-2 sm:mr-3 shadow-md flex-shrink-0">
                              <span className="text-white font-bold text-xs">◆</span>
                            </div>
                            <span className={`text-sm sm:text-base font-bold ${textClass}`}>ESKİ TAM/TL</span>
                          </div>
                        </td>
                        <td className={`px-3 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base font-bold ${textClass}`}>
                          <div className="flex items-center">
                            {formatNumber(prices.altin.ESKI_TAM.alis)}
                            {getPriceChangeArrow(prices.altin.ESKI_TAM, previousPrices?.altin?.ESKI_TAM)}
                          </div>
                        </td>
                        <td className={`px-3 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base font-bold ${textClass}`}>
                          <div className="flex items-center">
                            {formatNumber(prices.altin.ESKI_TAM.satis)}
                            {getPriceChangeArrow(prices.altin.ESKI_TAM, previousPrices?.altin?.ESKI_TAM)}
                          </div>
                        </td>
                        <td className={`px-3 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap text-xs sm:text-sm ${textClass} font-medium hidden sm:table-cell`}>
                          {prices.altin.ESKI_TAM.time || formatTime(prices.timestamp)}
                        </td>
                      </tr>
                    );
                  })()}

                  {/* YENİ YARIM */}
                  {prices.altin.YENI_YARIM && (() => {
                    const bgClass = getPriceChangeColor(prices.altin.YENI_YARIM, previousPrices?.altin?.YENI_YARIM, 'bg');
                    const textClass = getPriceChangeColor(prices.altin.YENI_YARIM, previousPrices?.altin?.YENI_YARIM, 'text');
                    const borderClass = bgClass.includes('green') ? 'border-green-500' : bgClass.includes('red') ? 'border-red-500' : '';
                    return (
                      <tr className={`${bgClass} transition-all duration-200 ${borderClass ? `border-l-4 ${borderClass}` : ''}`}>
                        <td className="px-3 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mr-2 sm:mr-3 shadow-md flex-shrink-0">
                              <span className="text-white font-bold text-xs">½</span>
                            </div>
                            <span className={`text-sm sm:text-base font-bold ${textClass}`}>YENİ YARIM/TL</span>
                          </div>
                        </td>
                        <td className={`px-3 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base font-bold ${textClass}`}>
                          <div className="flex items-center">
                            {formatNumber(prices.altin.YENI_YARIM.alis)}
                            {getPriceChangeArrow(prices.altin.YENI_YARIM, previousPrices?.altin?.YENI_YARIM)}
                          </div>
                        </td>
                        <td className={`px-3 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base font-bold ${textClass}`}>
                          <div className="flex items-center">
                            {formatNumber(prices.altin.YENI_YARIM.satis)}
                            {getPriceChangeArrow(prices.altin.YENI_YARIM, previousPrices?.altin?.YENI_YARIM)}
                          </div>
                        </td>
                        <td className={`px-3 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap text-xs sm:text-sm ${textClass} font-medium hidden sm:table-cell`}>
                          {prices.altin.YENI_YARIM.time || formatTime(prices.timestamp)}
                        </td>
                      </tr>
                    );
                  })()}

                  {/* ESKİ YARIM */}
                  {prices.altin.ESKI_YARIM && (() => {
                    const bgClass = getPriceChangeColor(prices.altin.ESKI_YARIM, previousPrices?.altin?.ESKI_YARIM, 'bg');
                    const textClass = getPriceChangeColor(prices.altin.ESKI_YARIM, previousPrices?.altin?.ESKI_YARIM, 'text');
                    const borderClass = bgClass.includes('green') ? 'border-green-500' : bgClass.includes('red') ? 'border-red-500' : '';
                    return (
                      <tr className={`${bgClass} transition-all duration-200 ${borderClass ? `border-l-4 ${borderClass}` : ''}`}>
                        <td className="px-3 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mr-2 sm:mr-3 shadow-md flex-shrink-0">
                              <span className="text-white font-bold text-xs">½</span>
                            </div>
                            <span className={`text-sm sm:text-base font-bold ${textClass}`}>ESKİ YARIM/TL</span>
                          </div>
                        </td>
                        <td className={`px-3 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base font-bold ${textClass}`}>
                          <div className="flex items-center">
                            {formatNumber(prices.altin.ESKI_YARIM.alis)}
                            {getPriceChangeArrow(prices.altin.ESKI_YARIM, previousPrices?.altin?.ESKI_YARIM)}
                          </div>
                        </td>
                        <td className={`px-3 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base font-bold ${textClass}`}>
                          <div className="flex items-center">
                            {formatNumber(prices.altin.ESKI_YARIM.satis)}
                            {getPriceChangeArrow(prices.altin.ESKI_YARIM, previousPrices?.altin?.ESKI_YARIM)}
                          </div>
                        </td>
                        <td className={`px-3 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap text-xs sm:text-sm ${textClass} font-medium hidden sm:table-cell`}>
                          {prices.altin.ESKI_YARIM.time || formatTime(prices.timestamp)}
                        </td>
                      </tr>
                    );
                  })()}

                  {/* YENİ CEYREK */}
                  {prices.altin.YENI_CEYREK && (() => {
                    const bgClass = getPriceChangeColor(prices.altin.YENI_CEYREK, previousPrices?.altin?.YENI_CEYREK, 'bg');
                    const textClass = getPriceChangeColor(prices.altin.YENI_CEYREK, previousPrices?.altin?.YENI_CEYREK, 'text');
                    const borderClass = bgClass.includes('green') ? 'border-green-500' : bgClass.includes('red') ? 'border-red-500' : '';
                    return (
                      <tr className={`${bgClass} transition-all duration-200 ${borderClass ? `border-l-4 ${borderClass}` : ''}`}>
                        <td className="px-3 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mr-2 sm:mr-3 shadow-md flex-shrink-0">
                              <span className="text-white font-bold text-xs">¼</span>
                            </div>
                            <span className={`text-sm sm:text-base font-bold ${textClass}`}>YENİ CEYREK/TL</span>
                          </div>
                        </td>
                        <td className={`px-3 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base font-bold ${textClass}`}>
                          <div className="flex items-center">
                            {formatNumber(prices.altin.YENI_CEYREK.alis)}
                            {getPriceChangeArrow(prices.altin.YENI_CEYREK, previousPrices?.altin?.YENI_CEYREK)}
                          </div>
                        </td>
                        <td className={`px-3 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base font-bold ${textClass}`}>
                          <div className="flex items-center">
                            {formatNumber(prices.altin.YENI_CEYREK.satis)}
                            {getPriceChangeArrow(prices.altin.YENI_CEYREK, previousPrices?.altin?.YENI_CEYREK)}
                          </div>
                        </td>
                        <td className={`px-3 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap text-xs sm:text-sm ${textClass} font-medium hidden sm:table-cell`}>
                          {prices.altin.YENI_CEYREK.time || formatTime(prices.timestamp)}
                        </td>
                      </tr>
                    );
                  })()}

                  {/* ESKİ CEYREK */}
                  {prices.altin.ESKI_CEYREK && (() => {
                    const bgClass = getPriceChangeColor(prices.altin.ESKI_CEYREK, previousPrices?.altin?.ESKI_CEYREK, 'bg');
                    const textClass = getPriceChangeColor(prices.altin.ESKI_CEYREK, previousPrices?.altin?.ESKI_CEYREK, 'text');
                    const borderClass = bgClass.includes('green') ? 'border-green-500' : bgClass.includes('red') ? 'border-red-500' : '';
                    return (
                      <tr className={`${bgClass} transition-all duration-200 ${borderClass ? `border-l-4 ${borderClass}` : ''}`}>
                        <td className="px-3 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mr-2 sm:mr-3 shadow-md flex-shrink-0">
                              <span className="text-white font-bold text-xs">¼</span>
                            </div>
                            <span className={`text-sm sm:text-base font-bold ${textClass}`}>ESKİ CEYREK/TL</span>
                          </div>
                        </td>
                        <td className={`px-3 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base font-bold ${textClass}`}>
                          <div className="flex items-center">
                            {formatNumber(prices.altin.ESKI_CEYREK.alis)}
                            {getPriceChangeArrow(prices.altin.ESKI_CEYREK, previousPrices?.altin?.ESKI_CEYREK)}
                          </div>
                        </td>
                        <td className={`px-3 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base font-bold ${textClass}`}>
                          <div className="flex items-center">
                            {formatNumber(prices.altin.ESKI_CEYREK.satis)}
                            {getPriceChangeArrow(prices.altin.ESKI_CEYREK, previousPrices?.altin?.ESKI_CEYREK)}
                          </div>
                        </td>
                        <td className={`px-3 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap text-xs sm:text-sm ${textClass} font-medium hidden sm:table-cell`}>
                          {prices.altin.ESKI_CEYREK.time || formatTime(prices.timestamp)}
                        </td>
                      </tr>
                    );
                  })()}

                  {/* 22 AYAR */}
                  {prices.altin.AYAR_22 && (() => {
                    const bgClass = getPriceChangeColor(prices.altin.AYAR_22, previousPrices?.altin?.AYAR_22, 'bg');
                    const textClass = getPriceChangeColor(prices.altin.AYAR_22, previousPrices?.altin?.AYAR_22, 'text');
                    const borderClass = bgClass.includes('green') ? 'border-green-500' : bgClass.includes('red') ? 'border-red-500' : '';
                    return (
                      <tr className={`${bgClass} transition-all duration-200 ${borderClass ? `border-l-4 ${borderClass}` : ''}`}>
                        <td className="px-3 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mr-2 sm:mr-3 shadow-md flex-shrink-0">
                              <span className="text-white font-bold text-xs">22</span>
                            </div>
                            <span className={`text-sm sm:text-base font-bold ${textClass}`}>22 AYAR/TL</span>
                          </div>
                        </td>
                        <td className={`px-3 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base font-bold ${textClass}`}>
                          <div className="flex items-center">
                            {formatNumber(prices.altin.AYAR_22.alis)}
                            {getPriceChangeArrow(prices.altin.AYAR_22, previousPrices?.altin?.AYAR_22)}
                          </div>
                        </td>
                        <td className={`px-3 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base font-bold ${textClass}`}>
                          <div className="flex items-center">
                            {formatNumber(prices.altin.AYAR_22.satis)}
                            {getPriceChangeArrow(prices.altin.AYAR_22, previousPrices?.altin?.AYAR_22)}
                          </div>
                        </td>
                        <td className={`px-3 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap text-xs sm:text-sm ${textClass} font-medium hidden sm:table-cell`}>
                          {prices.altin.AYAR_22.time || formatTime(prices.timestamp)}
                        </td>
                      </tr>
                    );
                  })()}

                  {/* GÜMÜŞ */}
                  {prices.gumus.GUMUS && (() => {
                    const bgClass = getPriceChangeColor(prices.gumus.GUMUS, previousPrices?.gumus?.GUMUS, 'bg');
                    const textClass = getPriceChangeColor(prices.gumus.GUMUS, previousPrices?.gumus?.GUMUS, 'text');
                    const borderClass = bgClass.includes('green') ? 'border-green-500' : bgClass.includes('red') ? 'border-red-500' : '';
                    return (
                      <tr className={`${bgClass} transition-all duration-200 ${borderClass ? `border-l-4 ${borderClass}` : ''}`}>
                        <td className="px-3 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center mr-2 sm:mr-3 shadow-md flex-shrink-0">
                              <span className="text-white font-bold text-xs">Ag</span>
                            </div>
                            <span className={`text-sm sm:text-base font-bold ${textClass}`}>GÜMÜŞ/TL</span>
                          </div>
                        </td>
                        <td className={`px-3 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base font-bold ${textClass}`}>
                          <div className="flex items-center">
                            {formatNumber(prices.gumus.GUMUS.alis)}
                            {getPriceChangeArrow(prices.gumus.GUMUS, previousPrices?.gumus?.GUMUS)}
                          </div>
                        </td>
                        <td className={`px-3 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap text-sm sm:text-base font-bold ${textClass}`}>
                          <div className="flex items-center">
                            {formatNumber(prices.gumus.GUMUS.satis)}
                            {getPriceChangeArrow(prices.gumus.GUMUS, previousPrices?.gumus?.GUMUS)}
                          </div>
                        </td>
                        <td className={`px-3 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap text-xs sm:text-sm ${textClass} font-medium hidden sm:table-cell`}>
                          {prices.gumus.GUMUS.time || formatTime(prices.timestamp)}
                        </td>
                      </tr>
                    );
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>

      {/* Footer */}
      <div className="mt-12 py-6 bg-gradient-to-r from-amber-600 to-yellow-600 text-white text-center">
        <p className="text-sm">© 2026 Doğa Kuyumculuk - Tüm hakları saklıdır</p>
      </div>
    </div>
  );
}

export default App;
