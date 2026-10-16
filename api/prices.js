// Vercel Serverless Function - CORS Proxy
// GET: /api/prices

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, OPTIONS');
    return res.status(405).json({
      error: 'Method not allowed',
    });
  }

  try {
    // Not: /api/prices ile /api/pricess farklı fiyat setleri döndürür.
    // Sukob ekranındaki rakamlar /api/pricess kaynağından gelir.
    const response = await fetch(
      `https://sukobfiyat.com/api/pricess/?cache=${Date.now()}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Mozilla/5.0',
        },
        cache: 'no-store',
      }
    );

    const contentType = response.headers.get('content-type') || '';
    const body = await response.text();

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Kaynak API hatası: ${response.status}`,
        contentType,
        response: body.substring(0, 1000),
      });
    }

    if (!contentType.toLowerCase().includes('application/json')) {
      return res.status(502).json({
        error: 'Kaynak API JSON döndürmedi.',
        contentType,
        response: body.substring(0, 1000),
      });
    }

    const data = JSON.parse(body);

    res.setHeader('Access-Control-Allow-Origin', '*');
    // Tarayıcıda 304 + boş body yüzünden fiyatların kaybolmasını engelle;
    // CDN tarafında kısa süre cache tut (s-maxage).
    res.setHeader(
      'Cache-Control',
      'public, max-age=0, s-maxage=15, stale-while-revalidate=30, must-revalidate'
    );

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: 'Proxy hatası',
      message: error.message,
    });
  }
}
