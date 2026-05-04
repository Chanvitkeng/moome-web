// GET /api/auth/me
// Returns current user + recent chat history (if logged in)

import { getCurrentUser } from '../_jwt.js';
import { getSupabase, getChatHistory } from '../_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://moome.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Method not allowed' });

  try {
    const session = await getCurrentUser(req);
    if (!session) {
      return res.status(200).json({ success: true, authenticated: false });
    }

    // Fetch latest user record
    const sb = getSupabase();
    const { data: user } = await sb
      .from('moome_users')
      .select('id, line_user_id, email, display_name, picture_url, birth_date, archetype')
      .eq('id', session.userId)
      .maybeSingle();

    if (!user) {
      return res.status(200).json({ success: true, authenticated: false });
    }

    const history = await getChatHistory(user.id, 20);

    return res.status(200).json({
      success: true,
      authenticated: true,
      user: {
        id: user.id,
        displayName: user.display_name,
        pictureUrl: user.picture_url,
        email: user.email,
        birthDate: user.birth_date,
        archetype: user.archetype,
      },
      history,
    });
  } catch (err) {
    console.error('me error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Internal error' });
  }
}
