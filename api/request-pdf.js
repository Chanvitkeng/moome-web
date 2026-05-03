// Vercel Function · POST /api/request-pdf
// Receives form submission · sends email to user via Resend
// + notification to admin
// L2B · Rich content email (12-section archetype report)

import { Resend } from 'resend';
import { archetypesContent } from './archetypes-content.js';

const resend = new Resend(process.env.RESEND_API_KEY);
const archetypes = archetypesContent;

const PALETTE = {
  cream: '#F5EFE6',
  plum: '#3d2c4e',
  midnight: '#0f0a1e',
  gold: '#c9a961',
  goldSoft: '#ead8b8',
  rose: '#b97a8b',
  lavender: '#b8a5c9',
};

function sectionHeader(emoji, label) {
  return `<div style="font-size:11px;letter-spacing:0.28em;color:${PALETTE.gold};text-transform:uppercase;font-weight:700;margin:36px 0 14px;">${emoji} ${label}</div>`;
}

function strengthGrowthCard(idx, title, desc, color) {
  return `<div style="background:white;border-left:4px solid ${color};border-radius:0 14px 14px 0;padding:18px 22px;margin-bottom:12px;">
    <div style="font-size:12px;color:${color};font-weight:700;letter-spacing:0.1em;margin-bottom:6px;">${idx}.</div>
    <div style="font-size:17px;font-weight:700;color:${PALETTE.midnight};margin-bottom:6px;">${title}</div>
    <div style="font-size:14.5px;color:${PALETTE.plum};line-height:1.6;">${desc}</div>
  </div>`;
}

function buildUserEmailHTML(num, archData, birthDate) {
  const archStr = String(num).padStart(2, '0');

  const strengthsHTML = archData.strengths.map((s, i) =>
    strengthGrowthCard(i + 1, s.title, s.desc, PALETTE.gold)
  ).join('');

  const growthHTML = archData.growth.map((g, i) =>
    strengthGrowthCard(i + 1, g.title, g.desc, PALETTE.rose)
  ).join('');

  const careersHTML = archData.careers.map(c =>
    `<li style="margin-bottom:8px;padding-left:18px;position:relative;">
       <span style="position:absolute;left:0;color:${PALETTE.gold};">✦</span>
       ${c}
     </li>`
  ).join('');

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:${PALETTE.cream};font-family:'Helvetica Neue',Arial,sans-serif;color:${PALETTE.midnight};line-height:1.7;">
<div style="max-width:640px;margin:0 auto;padding:32px 16px;">

  <!-- Header -->
  <div style="text-align:center;padding:24px 0;border-bottom:1px solid rgba(61,44,78,0.1);">
    <div style="font-size:13px;letter-spacing:0.32em;color:${PALETTE.gold};font-weight:700;">✦ MOOME</div>
    <div style="font-size:12px;color:${PALETTE.lavender};margin-top:4px;">ดวงที่ฟัง ก่อนพูด</div>
    <div style="font-size:11px;letter-spacing:0.2em;color:${PALETTE.lavender};margin-top:8px;text-transform:uppercase;">PERSONAL ARCHETYPE REPORT</div>
  </div>

  <!-- Hero archetype card -->
  <div style="background:linear-gradient(135deg,${PALETTE.plum},${PALETTE.midnight});color:${PALETTE.cream};border-radius:24px;padding:48px 24px;text-align:center;margin:32px 0;">
    <div style="font-size:13px;letter-spacing:0.28em;color:${PALETTE.goldSoft};text-transform:uppercase;font-weight:600;">DESTINY MATRIX · ARCHETYPE</div>
    <div style="font-size:120px;color:${PALETTE.gold};line-height:1;margin:16px 0;font-family:Georgia,serif;">${archStr}</div>
    <div style="font-size:13px;letter-spacing:0.18em;color:${PALETTE.goldSoft};text-transform:uppercase;">${archData.eng}</div>
    <div style="font-size:32px;font-weight:700;color:${PALETTE.cream};margin-top:8px;">${archData.th}</div>
    <div style="color:${PALETTE.goldSoft};margin-top:18px;font-size:15px;font-style:italic;">"${archData.tag}"</div>
  </div>

  <!-- Greeting -->
  <h1 style="font-size:24px;color:${PALETTE.midnight};margin-bottom:12px;font-weight:700;">สวัสดีครับ 💜</h1>
  <p style="font-size:15px;color:${PALETTE.plum};">ขอบคุณที่ใช้ Moome คำนวณ Destiny Matrix · รายงานนี้เจาะลึก archetype <strong>#${num} ${archData.th}</strong> สำหรับวันเกิด <strong>${birthDate}</strong></p>

  <!-- 1. Essence -->
  ${sectionHeader('🌟', 'ตัวตนของคุณ')}
  <p style="font-size:15.5px;color:${PALETTE.plum};line-height:1.85;">${archData.essence}</p>

  <!-- 2. Strengths -->
  ${sectionHeader('✦', '3 จุดแข็ง')}
  ${strengthsHTML}

  <!-- 3. Growth Areas -->
  ${sectionHeader('🌱', '3 พื้นที่เติบโต')}
  ${growthHTML}

  <!-- 4. Careers -->
  ${sectionHeader('💼', 'อาชีพที่เหมาะ')}
  <ul style="background:white;border-radius:14px;padding:22px 22px 22px 22px;list-style:none;color:${PALETTE.plum};font-size:14.5px;border:1px solid rgba(61,44,78,0.08);">
    ${careersHTML}
  </ul>

  <!-- 5. Relationships -->
  ${sectionHeader('💞', 'ในความสัมพันธ์')}
  <div style="background:linear-gradient(135deg,#fdf6f8,#fbe8ee);border-radius:14px;padding:22px;color:${PALETTE.plum};font-size:15px;line-height:1.75;">
    ${archData.relationships}
  </div>

  <!-- 6. Color + Symbol -->
  ${sectionHeader('🎨', 'สีนำโชค + สัญลักษณ์')}
  <div style="background:white;border-radius:14px;padding:22px;border:1px solid rgba(61,44,78,0.08);">
    <div style="margin-bottom:14px;">
      <div style="font-size:12px;color:${PALETTE.lavender};letter-spacing:0.15em;text-transform:uppercase;margin-bottom:4px;">สีนำโชค</div>
      <div style="font-size:15px;color:${PALETTE.plum};">${archData.color}</div>
    </div>
    <div>
      <div style="font-size:12px;color:${PALETTE.lavender};letter-spacing:0.15em;text-transform:uppercase;margin-bottom:4px;">สัญลักษณ์</div>
      <div style="font-size:15px;color:${PALETTE.plum};">${archData.symbol}</div>
    </div>
  </div>

  <!-- 7. Monthly Energy -->
  ${sectionHeader('🌅', 'พลังเดือนนี้')}
  <div style="background:linear-gradient(135deg,#fffbf2,#fef5e1);border:1px solid rgba(201,169,97,0.25);border-radius:14px;padding:22px;color:${PALETTE.plum};font-size:15px;line-height:1.75;">
    ${archData.monthlyEnergy}
  </div>

  <!-- 8. Life Stage Guide -->
  ${sectionHeader('🎓', 'ตามวัยของคุณ — เลือกอ่านอันที่ตรงใจ')}
  <div style="background:white;border-radius:14px;padding:6px;border:1px solid rgba(61,44,78,0.08);">
    <div style="background:#f4faf4;border-radius:10px;padding:18px 20px;margin-bottom:6px;">
      <div style="font-size:11px;letter-spacing:0.2em;color:${PALETTE.sage};text-transform:uppercase;font-weight:700;margin-bottom:8px;">📚 มัธยมปลาย (15-18)</div>
      <div style="font-size:14.5px;color:${PALETTE.plum};line-height:1.75;">${archData.lifeStage?.teen || ''}</div>
    </div>
    <div style="background:#fdf6f8;border-radius:10px;padding:18px 20px;margin-bottom:6px;">
      <div style="font-size:11px;letter-spacing:0.2em;color:${PALETTE.rose};text-transform:uppercase;font-weight:700;margin-bottom:8px;">🎒 มหาวิทยาลัย (18-23)</div>
      <div style="font-size:14.5px;color:${PALETTE.plum};line-height:1.75;">${archData.lifeStage?.university || ''}</div>
    </div>
    <div style="background:#fffbf2;border-radius:10px;padding:18px 20px;">
      <div style="font-size:11px;letter-spacing:0.2em;color:${PALETTE.gold};text-transform:uppercase;font-weight:700;margin-bottom:8px;">💼 วัยทำงาน (23+)</div>
      <div style="font-size:14.5px;color:${PALETTE.plum};line-height:1.75;">${archData.lifeStage?.working || ''}</div>
    </div>
  </div>

  <!-- 9. Affirmation -->
  ${sectionHeader('🙏', 'Affirmation ของคุณ')}
  <blockquote style="background:linear-gradient(135deg,${PALETTE.plum},${PALETTE.midnight});color:${PALETTE.goldSoft};border-radius:14px;padding:32px 24px;font-size:18px;font-style:italic;text-align:center;line-height:1.6;margin:0;">
    "${archData.affirmation}"
  </blockquote>

  <!-- Tools section -->
  <div style="background:white;border-radius:18px;padding:28px;margin:48px 0 32px;border:1px solid rgba(61,44,78,0.08);">
    <div style="font-size:11px;letter-spacing:0.22em;color:${PALETTE.gold};text-transform:uppercase;font-weight:600;margin-bottom:14px;">🎁 STEP NEXT</div>
    <h2 style="font-size:20px;color:${PALETTE.midnight};margin-bottom:16px;font-weight:700;">เครื่องมืออื่นๆ ของ Moome</h2>
    <ul style="padding-left:0;list-style:none;color:${PALETTE.plum};font-size:14.5px;margin:0;">
      <li style="margin-bottom:10px;">💞 <a href="https://moome.app/match/?d1=${birthDate.split('/')[0]}&m1=${birthDate.split('/')[1]}&y1=${birthDate.split('/')[2]}" style="color:${PALETTE.plum};text-decoration:none;border-bottom:1px solid ${PALETTE.gold};">เช็คดวงคู่</a> — เปรียบเทียบ archetype ของคุณกับใครก็ได้</li>
      <li style="margin-bottom:10px;">🌅 <a href="https://moome.app/today/" style="color:${PALETTE.plum};text-decoration:none;border-bottom:1px solid ${PALETTE.gold};">Daily Vibe</a> — สี · ลุค · พลังประจำวัน</li>
      <li style="margin-bottom:10px;">📖 <a href="https://moome.app/blog/" style="color:${PALETTE.plum};text-decoration:none;border-bottom:1px solid ${PALETTE.gold};">Blog</a> — บทความเจาะลึก 22 archetypes</li>
    </ul>
  </div>

  <!-- LINE OA invite -->
  <div style="background:linear-gradient(135deg,#f0fbf3,#d8f2e0);border-radius:18px;padding:28px;text-align:center;margin:32px 0;">
    <div style="font-size:32px;margin-bottom:8px;">💬</div>
    <h2 style="font-size:20px;color:${PALETTE.midnight};margin-bottom:8px;">Add LINE — รับ Daily Vibe ทุกเช้า</h2>
    <p style="font-size:14.5px;color:${PALETTE.plum};margin-bottom:18px;">รู้ทันสี/อารมณ์ในวันสำคัญ · ฟรี</p>
    <a href="https://line.me/R/ti/p/@262zpsua" style="display:inline-block;background:#06C755;color:white;padding:12px 28px;border-radius:999px;text-decoration:none;font-weight:600;font-size:14px;">เพิ่มเพื่อน @262zpsua →</a>
  </div>

  <!-- Disclaimer -->
  <div style="text-align:center;padding:24px 0;color:${PALETTE.lavender};font-size:12px;line-height:1.7;">
    <p>Moome.app · เพื่อ self-awareness และ entertainment</p>
    <p>ไม่ใช่ medical/legal/financial advice</p>
    <p style="margin-top:12px;">
      <a href="https://moome.app" style="color:${PALETTE.lavender};">moome.app</a> ·
      <a href="https://line.me/R/ti/p/@262zpsua" style="color:${PALETTE.lavender};">LINE OA</a>
    </p>
  </div>

</div>
</body>
</html>`;
}

function buildAdminEmailHTML(email, archStr, archData, birthDate, source) {
  return `<!DOCTYPE html>
<html><body style="font-family:Arial,sans-serif;color:#333;line-height:1.7;padding:24px;max-width:560px;margin:0 auto;">
<h2 style="color:${PALETTE.plum};">📥 New Email Lead · Moome</h2>
<table style="width:100%;border-collapse:collapse;margin:16px 0;">
  <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;width:140px;">Email</td><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600;">${email}</td></tr>
  <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Archetype</td><td style="padding:8px;border-bottom:1px solid #eee;">${archStr} · ${archData.th} (${archData.eng})</td></tr>
  <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Birth date</td><td style="padding:8px;border-bottom:1px solid #eee;">${birthDate}</td></tr>
  <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Source</td><td style="padding:8px;border-bottom:1px solid #eee;">${source}</td></tr>
  <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Time</td><td style="padding:8px;border-bottom:1px solid #eee;">${new Date().toISOString()}</td></tr>
</table>
<p style="color:#888;font-size:13px;">User ได้รับ summary email อัตโนมัติแล้ว · เพิ่ม email นี้ใน mailing list ของคุณได้</p>
</body></html>`;
}

export default async function handler(req, res) {
  // CORS for moome.app
  res.setHeader('Access-Control-Allow-Origin', 'https://moome.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { email, archetype, archetype_name, birth_date, source, botcheck } = req.body || {};

    // Honeypot
    if (botcheck) {
      return res.status(200).json({ success: true });
    }

    // Validate
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'Invalid email' });
    }

    const archNum = parseInt(String(archetype).replace('#', '')) || 0;
    if (archNum < 1 || archNum > 22) {
      return res.status(400).json({ success: false, error: 'Invalid archetype' });
    }

    const archData = archetypes[archNum];
    const archStr = '#' + archNum;

    // 1. Send rich report email to user
    const userResult = await resend.emails.send({
      from: 'Moome <onboarding@resend.dev>',
      to: email,
      subject: `📕 Personal Archetype Report · ${archStr} ${archData.th} · Moome`,
      html: buildUserEmailHTML(archNum, archData, birth_date),
      reply_to: 'chanvit.kasetpiban@gmail.com',
    });

    if (userResult.error) {
      throw new Error('User email failed: ' + userResult.error.message);
    }

    // 2. Send admin notification (don't fail the request if admin email fails)
    try {
      await resend.emails.send({
        from: 'Moome <onboarding@resend.dev>',
        to: 'chanvit.kasetpiban@gmail.com',
        subject: `📥 New lead · ${archStr} ${archData.th} · ${email}`,
        html: buildAdminEmailHTML(email, archStr, archData, birth_date, source || 'unknown'),
      });
    } catch (adminErr) {
      console.error('Admin email failed:', adminErr);
    }

    return res.status(200).json({ success: true, id: userResult.data?.id });

  } catch (err) {
    console.error('Email error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal error'
    });
  }
}
