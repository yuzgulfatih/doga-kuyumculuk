// Vercel Serverless Function - API Proxy
// CORS sorununu çözmek için backend'den API isteği yapıyoruz

export default async function handler(req, res) {
  // OPTIONS isteği için CORS headers döndür
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // Sadece POST isteklerine izin ver
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const API_URL = 'https://www.guneskuyumcusu.com.tr/Info/GetProductInfo';
    const timestamp = Date.now();

    // API'ye POST isteği gönder
    const response = await fetch(`${API_URL}?_=${timestamp}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      console.error('API yanıt hatası:', response.status, response.statusText);
      return res.status(response.status).json({ 
        error: `API hatası: ${response.status}` 
      });
    }

    const data = await response.json();

    // CORS headers ekle
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    return res.status(200).json(data);
  } catch (error) {
    console.error('API proxy hatası:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

