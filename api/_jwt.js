// JWT sign/verify for Moome session tokens
// Uses jose (ESM-native) with HS256

import { SignJWT, jwtVerify } from 'jose';

const SECRET_STR = process.env.JWT_SECRET || 'moome-dev-secret-change-in-production';
const SECRET = new TextEncoder().encode(SECRET_STR);
const ISSUER = 'moome.app';
const AUDIENCE = 'moome.app';
const TOKEN_TTL = '30d';

export async function signSession({ userId, lineUserId, email, displayName }) {
  return await new SignJWT({
    sub: userId,
    line: lineUserId || null,
    email: email || null,
    name: displayName || null,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setExpirationTime(TOKEN_TTL)
    .sign(SECRET);
}

export async function verifySession(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET, {
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    return {
      userId: payload.sub,
      lineUserId: payload.line || null,
      email: payload.email || null,
      displayName: payload.name || null,
    };
  } catch (e) {
    return null;
  }
}

// Extract token from request (Authorization header or cookie)
export function getTokenFromRequest(req) {
  const auth = req.headers.authorization || req.headers.Authorization;
  if (auth && typeof auth === 'string') {
    const m = auth.match(/^Bearer\s+(.+)$/i);
    if (m) return m[1];
  }
  // Cookie fallback
  const cookieHeader = req.headers.cookie;
  if (cookieHeader && typeof cookieHeader === 'string') {
    const m = cookieHeader.match(/(?:^|;\s*)moome_session=([^;]+)/);
    if (m) return decodeURIComponent(m[1]);
  }
  return null;
}

export async function getCurrentUser(req) {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  return await verifySession(token);
}
