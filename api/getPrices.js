// Vercel Serverless Function - CORS proxy
// https://sukobfiyat.com/api/prices (GET, ~30 sn güncellenir)

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const API_URL = 'https://sukobfiyat.com/api/prices';
    const timestamp = Date.now();

    const response = await fetch(`${API_URL}?_=${timestamp}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `API hatası: ${response.status}`,
      });
    }

    const data = await response.json();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}
