// POST /api/profile/save-birth
// Body: { birthDate, archetype }
// Saves birth date + archetype to logged-in user's profile

import { getCurrentUser } from '../_jwt.js';
import { updateUserBirth } from '../_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://moome.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  try {
    const session = await getCurrentUser(req);
    if (!session) {
      return res.status(401).json({ success: false, error: 'Not logged in' });
    }

    const { birthDate, archetype } = req.body || {};
    if (!birthDate || !/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(birthDate)) {
      return res.status(400).json({ success: false, error: 'Invalid birth date format' });
    }
    const archNum = parseInt(archetype);
    if (!archNum || archNum < 1 || archNum > 22) {
      return res.status(400).json({ success: false, error: 'Invalid archetype' });
    }

    await updateUserBirth(session.userId, birthDate, archNum);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('save-birth error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Internal error' });
  }
}
