// POST /api/auth/liff-login
// Body: { idToken, accessToken? }
// Verifies LIFF ID token via LINE API · creates/updates user · returns Moome session JWT

import { upsertUser } from '../_supabase.js';
import { signSession } from '../_jwt.js';

const LIFF_CHANNEL_ID = process.env.LIFF_CHANNEL_ID;

async function verifyIdToken(idToken) {
  if (!LIFF_CHANNEL_ID) {
    throw new Error('LIFF_CHANNEL_ID env var missing');
  }
  // POST form-encoded to LINE verify endpoint
  const body = new URLSearchParams({
    id_token: idToken,
    client_id: LIFF_CHANNEL_ID,
  });

  const res = await fetch('https://api.line.me/oauth2/v2.1/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error('LINE token verify failed: ' + text);
  }

  const data = await res.json();
  // data shape:
  // { iss, sub (LINE userId), aud, exp, iat, name, picture, email? }
  return {
    lineUserId: data.sub,
    displayName: data.name || null,
    pictureUrl: data.picture || null,
    email: data.email || null,
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://moome.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  try {
    const { idToken, birthDate, archetype } = req.body || {};
    if (!idToken) return res.status(400).json({ success: false, error: 'idToken required' });

    // 1. Verify LIFF ID token with LINE API
    const profile = await verifyIdToken(idToken);

    // 2. Upsert user in Supabase
    const user = await upsertUser({
      lineUserId: profile.lineUserId,
      email: profile.email,
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl,
      birthDate: birthDate || null,
      archetype: archetype || null,
    });

    // 3. Sign Moome session JWT
    const sessionToken = await signSession({
      userId: user.id,
      lineUserId: user.line_user_id,
      email: user.email,
      displayName: user.display_name,
    });

    // 4. Set cookie + return token
    const cookieValue = `moome_session=${encodeURIComponent(sessionToken)}; Path=/; Max-Age=${30 * 24 * 60 * 60}; HttpOnly; Secure; SameSite=Lax`;
    res.setHeader('Set-Cookie', cookieValue);

    return res.status(200).json({
      success: true,
      token: sessionToken,
      user: {
        id: user.id,
        displayName: user.display_name,
        pictureUrl: user.picture_url,
        email: user.email,
        birthDate: user.birth_date,
        archetype: user.archetype,
      },
    });
  } catch (err) {
    console.error('LIFF login error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Login failed' });
  }
}
