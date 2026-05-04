// LINE Messaging API helpers
// Used by /api/line-webhook.js

const LINE_API_BASE = 'https://api.line.me/v2/bot';

function getToken() {
  const t = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!t) throw new Error('LINE_CHANNEL_ACCESS_TOKEN env missing');
  return t;
}

// Reply to a user message (must be called within 30s of receiving event)
export async function replyMessage(replyToken, messages) {
  if (!Array.isArray(messages)) messages = [messages];
  const res = await fetch(`${LINE_API_BASE}/message/reply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      replyToken,
      messages: messages.slice(0, 5), // LINE limit: 5 per reply
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('LINE reply failed:', res.status, text);
    throw new Error('LINE reply failed: ' + text);
  }
  return res.json();
}

// Push a message to user (anytime)
export async function pushMessage(userId, messages) {
  if (!Array.isArray(messages)) messages = [messages];
  const res = await fetch(`${LINE_API_BASE}/message/push`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      to: userId,
      messages: messages.slice(0, 5),
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('LINE push failed:', res.status, text);
    throw new Error('LINE push failed: ' + text);
  }
  return res.json();
}

// Get LINE user profile (display name, picture, status)
export async function getUserProfile(userId) {
  const res = await fetch(`${LINE_API_BASE}/profile/${userId}`, {
    headers: { 'Authorization': `Bearer ${getToken()}` },
  });
  if (!res.ok) {
    console.warn('LINE profile fetch failed:', res.status);
    return null;
  }
  return res.json();
}

// Convenience: text-only message
export function textMessage(text, quickReply) {
  const msg = { type: 'text', text: String(text).substring(0, 4900) };
  if (quickReply) msg.quickReply = quickReply;
  return msg;
}
