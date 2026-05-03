// Vercel Function · POST /api/request-pdf
// Receives form submission · sends email to user via Resend
// + notification to admin

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// 22 Archetypes (mirror of frontend data — kept here for email content)
const archetypes = {
  1:  { eng: "The Magician",        th: "นักสร้างสรรค์",      tag: "คนที่เปลี่ยนความคิดให้กลายเป็นจริง" },
  2:  { eng: "The High Priestess",  th: "ผู้หยั่งรู้",        tag: "คนที่อ่านความรู้สึกได้ลึกที่สุด" },
  3:  { eng: "The Empress",         th: "จักรพรรดินี",        tag: "คนที่สร้างความอบอุ่นและความงามให้โลก" },
  4:  { eng: "The Emperor",         th: "ผู้สร้างฐาน",        tag: "ผู้นำที่สร้างโครงสร้างมั่นคง" },
  5:  { eng: "The Hierophant",      th: "ครูแห่งจิตวิญญาณ",   tag: "ผู้นำทางความรู้และศรัทธา" },
  6:  { eng: "The Lovers",          th: "ผู้รัก",             tag: "คนที่เข้าใจความสัมพันธ์ลึกซึ้ง" },
  7:  { eng: "The Chariot",         th: "ผู้พิชิต",           tag: "ผู้ผลักดันสิ่งยากให้สำเร็จ" },
  8:  { eng: "Strength",            th: "พลังภายใน",          tag: "ผู้ใช้ความนุ่มนวลเอาชนะแรง" },
  9:  { eng: "The Hermit",          th: "ผู้แสวงหา",          tag: "ผู้แสวงหาความจริงในความเงียบ" },
  10: { eng: "Wheel of Fortune",    th: "วงล้อแห่งโชค",       tag: "ผู้ที่ชีวิตเปลี่ยนได้รวดเร็ว" },
  11: { eng: "Justice",             th: "ผู้ตัดสินด้วยใจ",    tag: "คนที่มองเห็นความสมดุล" },
  12: { eng: "The Hanged",          th: "ผู้มองมุมต่าง",      tag: "คนที่เห็นโลกจากมุมที่คนอื่นไม่เห็น" },
  13: { eng: "Death",               th: "ผู้ผ่านการเปลี่ยน",  tag: "ผู้กล้าทิ้งของเดิมเพื่อเริ่มใหม่" },
  14: { eng: "Temperance",          th: "ผู้สมดุล",           tag: "คนที่ผสานสิ่งตรงข้ามได้" },
  15: { eng: "The Devil",           th: "ผู้ปลดพันธนาการ",    tag: "ผู้เห็นเงาของตัวเองและรับรู้" },
  16: { eng: "The Tower",           th: "ผู้สร้างใหม่",       tag: "ผู้กล้าทุบของเก่าเพื่อสร้างใหม่" },
  17: { eng: "The Star",            th: "ผู้ส่องแสง",         tag: "ผู้นำความหวังหลังพายุ" },
  18: { eng: "The Moon",            th: "ผู้ฝัน",             tag: "ผู้เห็นในจิตใต้สำนึก" },
  19: { eng: "The Sun",             th: "ดวงอาทิตย์",         tag: "ผู้สร้างความยินดีและพลังบวก" },
  20: { eng: "Judgement",           th: "ผู้ตื่นรู้",         tag: "ผู้ได้ยินเสียงเรียกของจิตวิญญาณ" },
  21: { eng: "The World",           th: "ผู้สำเร็จ",          tag: "ผู้ครบวงจรชีวิตในรอบหนึ่ง" },
  22: { eng: "The Innocent",        th: "ผู้เริ่มใหม่",       tag: "คนที่กล้าก้าวสู่สิ่งที่ไม่รู้" },
};

const PALETTE = {
  cream: '#F5EFE6',
  plum: '#3d2c4e',
  midnight: '#0f0a1e',
  gold: '#c9a961',
  goldSoft: '#ead8b8',
  rose: '#b97a8b',
  lavender: '#b8a5c9',
};

function buildUserEmailHTML(num, archData, birthDate) {
  const archStr = String(num).padStart(2, '0');
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:${PALETTE.cream};font-family:'Helvetica Neue',Arial,sans-serif;color:${PALETTE.midnight};line-height:1.7;">
<div style="max-width:600px;margin:0 auto;padding:32px 16px;">

  <!-- Header -->
  <div style="text-align:center;padding:24px 0;border-bottom:1px solid rgba(61,44,78,0.1);">
    <div style="font-size:13px;letter-spacing:0.32em;color:${PALETTE.gold};font-weight:700;">✦ MOOME</div>
    <div style="font-size:12px;color:${PALETTE.lavender};margin-top:4px;">ดวงที่ฟัง ก่อนพูด</div>
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
  <p style="font-size:15px;color:${PALETTE.plum};">ขอบคุณที่ใช้ Moome คำนวณ Destiny Matrix ของคุณ · นี่คือสรุปย่อของ archetype <strong>#${num} ${archData.th}</strong> สำหรับวันเกิด <strong>${birthDate}</strong></p>

  <!-- Tools section -->
  <div style="background:white;border-radius:18px;padding:28px;margin:32px 0;border:1px solid rgba(61,44,78,0.08);">
    <div style="font-size:11px;letter-spacing:0.22em;color:${PALETTE.gold};text-transform:uppercase;font-weight:600;margin-bottom:14px;">🎁 STEP NEXT</div>
    <h2 style="font-size:20px;color:${PALETTE.midnight};margin-bottom:16px;font-weight:700;">เครื่องมืออื่นๆ ของ Moome</h2>
    <ul style="padding-left:0;list-style:none;color:${PALETTE.plum};font-size:14.5px;">
      <li style="margin-bottom:10px;">💞 <a href="https://moome.app/match/" style="color:${PALETTE.plum};text-decoration:none;border-bottom:1px solid ${PALETTE.gold};">เช็คดวงคู่</a> — เปรียบเทียบ archetype ของคุณกับใครก็ได้</li>
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

  <!-- PDF coming soon -->
  <div style="background:linear-gradient(135deg,#fffbf2,#fef5e1);border-radius:18px;padding:28px;text-align:center;margin:32px 0;border:1px solid rgba(201,169,97,0.3);">
    <div style="font-size:11px;letter-spacing:0.22em;color:${PALETTE.gold};text-transform:uppercase;font-weight:600;margin-bottom:8px;">📕 PDF REPORT — COMING SOON</div>
    <p style="font-size:14.5px;color:${PALETTE.plum};">เรากำลังเตรียม PDF report เจาะลึก archetype ของคุณ 12 หน้า · จะส่งให้ภายในสัปดาห์นี้ · โปรดเช็ค inbox อีกครั้ง</p>
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

    // 1. Send summary email to user
    const userResult = await resend.emails.send({
      from: 'Moome <onboarding@resend.dev>',
      to: email,
      subject: `✦ Archetype ${archStr} ${archData.th} · สรุปจาก Moome`,
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
