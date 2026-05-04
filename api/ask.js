// Vercel Function · POST /api/ask
// User asks a question → Claude Haiku answers with archetype context
// Server-side rate limit: 5/day per IP for anonymous · 50/day if email provided

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 800;

// In-memory rate limit (resets on cold start — good enough for MVP)
const rateLimits = new Map();
const HOURS_24 = 24 * 60 * 60 * 1000;

function getRateLimitKey(ip, email) {
  return email ? `email:${email.toLowerCase()}` : `ip:${ip}`;
}

function checkRateLimit(key, maxPerDay) {
  const now = Date.now();
  const entry = rateLimits.get(key);

  if (!entry || (now - entry.firstAt) > HOURS_24) {
    rateLimits.set(key, { count: 1, firstAt: now });
    return { allowed: true, remaining: maxPerDay - 1 };
  }

  if (entry.count >= maxPerDay) {
    const resetIn = HOURS_24 - (now - entry.firstAt);
    return { allowed: false, remaining: 0, resetInMs: resetIn };
  }

  entry.count += 1;
  return { allowed: true, remaining: maxPerDay - entry.count };
}

const ARCHETYPE_NAMES = {
  1: 'นักสร้างสรรค์ (Magician)',
  2: 'ผู้หยั่งรู้ (High Priestess)',
  3: 'จักรพรรดินี (Empress)',
  4: 'จักรพรรดิ (Emperor)',
  5: 'ผู้ส่งสาร (Hierophant)',
  6: 'คู่รัก (Lovers)',
  7: 'ผู้พิชิต (Chariot)',
  8: 'ผู้ทรงพลัง (Strength)',
  9: 'ผู้แสวงหา (Hermit)',
  10: 'วงล้อโชค (Wheel of Fortune)',
  11: 'ผู้ยุติธรรม (Justice)',
  12: 'ผู้เสียสละ (Hanged Man)',
  13: 'การเปลี่ยน (Death)',
  14: 'ผู้สมดุล (Temperance)',
  15: 'ผู้ผูกมัด (Devil)',
  16: 'ผู้สร้างใหม่ (Tower)',
  17: 'ดวงดาว (Star)',
  18: 'พระจันทร์ (Moon)',
  19: 'พระอาทิตย์ (Sun)',
  20: 'ผู้ตื่นรู้ (Judgement)',
  21: 'ผู้สำเร็จ (World)',
  22: 'ผู้เริ่มใหม่ (Innocent)',
};

function buildSystemPrompt(archetype, birthDate, archName) {
  const archStr = archetype ? `#${archetype} ${ARCHETYPE_NAMES[archetype] || archName || ''}` : '(ยังไม่ระบุ)';
  const birthStr = birthDate || '(ยังไม่ระบุ)';

  return `คุณคือผู้ช่วยของ Moome — แพลตฟอร์ม self-awareness ที่ใช้ Russian Destiny Matrix (22 archetypes ตาม Tarot Major Arcana)

ข้อมูลของผู้ถามรอบนี้:
- Archetype: ${archStr}
- วันเกิด: ${birthStr}

แนวทางการตอบ:
1. ตอบเป็นภาษาไทยเสมอ (ใช้ภาษาไทยล้วน · ไม่ผสมอังกฤษเกินจำเป็น · ใช้คำธรรมดา ไม่หรูเกิน)
2. ตอบสั้น กระชับ ใช้น้ำเสียงอุ่น เป็นมิตร เหมือนเพื่อนที่เข้าใจศาสตร์มู
3. อ้างอิง archetype ของผู้ถามถ้าเข้ากับคำถาม (อย่ายัด ถ้าไม่เกี่ยว ก็ไม่ต้อง)
4. ห้ามให้คำแนะนำทางการแพทย์ กฎหมาย หรือการเงินแบบเฉพาะเจาะจง — แนะนำให้ปรึกษาผู้เชี่ยวชาญแทน
5. ห้ามทำนายอนาคตแบบกำหนดได้ 100% — Moome คือ self-awareness ไม่ใช่หมอดู
6. ถ้าผู้ถามเศร้าหนัก / มีความคิดทำร้ายตัวเอง → แนะนำสายด่วนสุขภาพจิต 1323 (กรมสุขภาพจิต) ทันทีและไม่หาเหตุผล
7. ความยาวคำตอบ: 2-4 ย่อหน้า สั้นๆ ไม่ยาว
8. ถ้าคำถามไม่เกี่ยวกับ self-awareness/ชีวิต/ความสัมพันธ์/การงาน — ตอบสั้นๆ ว่าไม่ใช่ขอบเขต Moome และเสนอให้ถามเรื่องที่เกี่ยวข้อง

จดจำว่า: คุณกำลังคุยกับคนที่เพิ่งรู้จัก archetype ของตัวเอง · ตอบในมุมที่ช่วยให้เขาเข้าใจตัวเองมากขึ้น`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://moome.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, error: 'API not configured' });
    }

    const {
      question,
      archetype,
      archetype_name,
      birth_date,
      email,
      history,
      botcheck,
    } = req.body || {};

    if (botcheck) return res.status(200).json({ success: true, answer: 'ok' });

    if (!question || typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({ success: false, error: 'กรุณาใส่คำถาม' });
    }

    const safeQ = String(question).substring(0, 1000).trim();

    // Rate limit
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.headers['x-real-ip'] || 'unknown';
    const safeEmail = email && email.includes('@') ? String(email).substring(0, 200).trim() : null;
    const rateLimitKey = getRateLimitKey(ip, safeEmail);
    const maxPerDay = safeEmail ? 50 : 5;
    const limit = checkRateLimit(rateLimitKey, maxPerDay);

    if (!limit.allowed) {
      const hours = Math.ceil((limit.resetInMs || 0) / (60 * 60 * 1000));
      return res.status(429).json({
        success: false,
        error: `เกิน limit วันนี้แล้ว (${maxPerDay}/วัน) · ลองใหม่ใน ${hours} ชั่วโมง · ใส่ email เพื่อปลดล็อค 50/วัน`,
        rateLimited: true,
        remaining: 0,
      });
    }

    // Build messages
    const archNum = archetype ? parseInt(String(archetype).replace('#', '')) : null;
    const systemPrompt = buildSystemPrompt(archNum, birth_date, archetype_name);

    const messages = [];
    // Optional conversation history (last 6 turns max)
    if (Array.isArray(history) && history.length > 0) {
      const recent = history.slice(-6);
      for (const turn of recent) {
        if (turn && turn.role && turn.content && (turn.role === 'user' || turn.role === 'assistant')) {
          messages.push({
            role: turn.role,
            content: String(turn.content).substring(0, 2000),
          });
        }
      }
    }
    messages.push({ role: 'user', content: safeQ });

    // Call Anthropic
    const apiRes = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: systemPrompt,
        messages,
      }),
    });

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      console.error('Anthropic error:', apiRes.status, errText);
      return res.status(502).json({ success: false, error: 'AI service error' });
    }

    const data = await apiRes.json();
    const answer = data?.content?.[0]?.text || '(ไม่มีคำตอบ)';

    return res.status(200).json({
      success: true,
      answer,
      remaining: limit.remaining,
      maxPerDay,
      isEmailUser: !!safeEmail,
    });
  } catch (err) {
    console.error('Ask error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal error'
    });
  }
}
