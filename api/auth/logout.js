// POST /api/auth/logout
// Clears cookie · client should also delete localStorage token

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://moome.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  // Expire cookie
  res.setHeader(
    'Set-Cookie',
    'moome_session=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax'
  );
  return res.status(200).json({ success: true });
}
