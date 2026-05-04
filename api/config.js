// GET /api/config
// Returns public configuration for frontend (LIFF ID, etc.)
// All values here MUST be safe to expose publicly

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://moome.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=600');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  return res.status(200).json({
    liffId: process.env.NEXT_PUBLIC_LIFF_ID || null,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || null,
    // anon key is safe public · only needed if using Supabase JS client directly from frontend
    // For V4.0 we route everything through API, so no need to expose
  });
}
