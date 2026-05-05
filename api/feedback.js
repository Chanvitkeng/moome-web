// Vercel Function · POST /api/feedback
// Receives user feedback from widget · sends email to admin via Resend

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const MOOD_LABEL = {
  love: '😍 ชอบมาก',
  like: '🙂 ดี',
  ok:   '😐 เฉยๆ',
  bad:  '😞 ไม่โอเค',
};

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildAdminEmailHTML({ mood, message, email, page, ua }) {
  const moodLabel = MOOD_LABEL[mood] || (mood ? `(${mood})` : '—');
  const msgHtml = escapeHtml(message).replace(/\n/g, '<br>') || '<em style="color:#999;">(ไม่มีข้อความ)</em>';
  const emailHtml = email ? escapeHtml(email) : '<em style="color:#999;">(ไม่ระบุ)</em>';

  return `<!DOCTYPE html>
<html><body style="font-family:'Helvetica Neue',Arial,sans-serif;color:#333;line-height:1.7;padding:24px;max-width:560px;margin:0 auto;background:#F5EFE6;">
<div style="background:white;border-radius:18px;padding:28px 24px;">
  <div style="font-size:11px;letter-spacing:0.28em;color:#c9a961;text-transform:uppercase;font-weight:700;margin-bottom:6px;">✦ MOOME · FEEDBACK</div>
  <h2 style="color:#3d2c4e;margin:0 0 18px;font-size:22px;">💬 New User Feedback</h2>

  <div style="background:#fffbf2;border-left:4px solid #c9a961;border-radius:0 12px 12px 0;padding:16px 18px;margin-bottom:16px;">
    <div style="font-size:11px;letter-spacing:0.18em;color:#c9a961;text-transform:uppercase;margin-bottom:6px;font-weight:700;">Mood</div>
    <div style="font-size:18px;color:#3d2c4e;font-weight:600;">${moodLabel}</div>
  </div>

  <div style="background:#fdf6f8;border-left:4px solid #b97a8b;border-radius:0 12px 12px 0;padding:16px 18px;margin-bottom:16px;">
    <div style="font-size:11px;letter-spacing:0.18em;color:#b97a8b;text-transform:uppercase;margin-bottom:6px;font-weight:700;">ข้อความ</div>
    <div style="font-size:15px;color:#3d2c4e;line-height:1.75;">${msgHtml}</div>
  </div>

  <table style="width:100%;border-collapse:collapse;margin:8px 0;">
    <tr><td style="padding:8px 4px;border-bottom:1px solid #eee;color:#888;width:120px;font-size:13px;">Email</td><td style="padding:8px 4px;border-bottom:1px solid #eee;font-size:13.5px;">${emailHtml}</td></tr>
    <tr><td style="padding:8px 4px;border-bottom:1px solid #eee;color:#888;font-size:13px;">Page</td><td style="padding:8px 4px;border-bottom:1px solid #eee;font-size:13.5px;font-family:monospace;">${escapeHtml(page)}</td></tr>
    <tr><td style="padding:8px 4px;border-bottom:1px solid #eee;color:#888;font-size:13px;">User Agent</td><td style="padding:8px 4px;border-bottom:1px solid #eee;font-size:12px;color:#666;">${escapeHtml(ua)}</td></tr>
    <tr><td style="padding:8px 4px;color:#888;font-size:13px;">Time</td><td style="padding:8px 4px;font-size:13.5px;">${new Date().toISOString()}</td></tr>
  </table>

  <p style="margin-top:18px;color:#888;font-size:12px;line-height:1.6;">
    ตอบกลับ user โดยตรงได้ที่ ${email ? `<a href="mailto:${escapeHtml(email)}?subject=Re: Moome feedback" style="color:#c9a961;">${escapeHtml(email)}</a>` : '(user ไม่ได้ใส่ email)'}
  </p>
</div>
</body></html>`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://moome.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  try {
    const { mood, message, email, page, ua, botcheck } = req.body || {};

    // Honeypot — silently succeed if bot
    if (botcheck) return res.status(200).json({ success: true });

    // Need at least mood OR message
    if (!mood && (!message || !message.trim())) {
      return res.status(400).json({ success: false, error: 'กรุณาเลือก mood หรือเขียนข้อความ' });
    }

    // Length cap (defensive)
    const safeMessage = String(message || '').substring(0, 4000);
    const safeEmail = String(email || '').substring(0, 200);
    const safePage = String(page || '').substring(0, 300);
    const safeUa = String(ua || '').substring(0, 250);
    const safeMood = ['love', 'like', 'ok', 'bad'].includes(mood) ? mood : null;

    const moodLabel = MOOD_LABEL[safeMood] || '—';
    const subject = `💬 Feedback ${moodLabel}${safeEmail ? ` · ${safeEmail}` : ''}`;

    const result = await resend.emails.send({
      from: 'Moome Feedback <hello@moome.app>',
      to: 'chanvit.kasetpiban@gmail.com',
      reply_to: safeEmail && safeEmail.includes('@') ? safeEmail : undefined,
      subject,
      html: buildAdminEmailHTML({
        mood: safeMood,
        message: safeMessage,
        email: safeEmail,
        page: safePage,
        ua: safeUa,
      }),
    });

    if (result.error) {
      throw new Error(result.error.message || 'Email failed');
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Feedback error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal error'
    });
  }
}
