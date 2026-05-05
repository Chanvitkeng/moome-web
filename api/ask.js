// Vercel Function · POST /api/ask
// User asks a question → Claude Haiku answers with archetype context
// Server-side rate limit: 5/day per IP for anonymous · 50/day if email · 100/day if logged in

import { getCurrentUser } from './_jwt.js';
import { saveChatMessage, getChatHistory, getUserFacts } from './_supabase.js';

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 900;  // reduced from 1400 → fits in Vercel Hobby 10s timeout

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
  1: 'นักสร้างสรรค์ (The Magician)',
  2: 'ผู้หยั่งรู้ (The High Priestess)',
  3: 'จักรพรรดินี (The Empress)',
  4: 'ผู้สร้างฐาน (The Emperor)',
  5: 'ครูแห่งจิตวิญญาณ (The Hierophant)',
  6: 'ผู้รัก (The Lovers)',
  7: 'ผู้พิชิต (The Chariot)',
  8: 'พลังภายใน (Strength)',
  9: 'ผู้แสวงหา (The Hermit)',
  10: 'วงล้อแห่งโชค (Wheel of Fortune)',
  11: 'ผู้ตัดสินด้วยใจ (Justice)',
  12: 'ผู้มองมุมต่าง (The Hanged)',
  13: 'ผู้ผ่านการเปลี่ยน (Death)',
  14: 'ผู้สมดุล (Temperance)',
  15: 'ผู้ปลดพันธนาการ (The Devil)',
  16: 'ผู้สร้างใหม่ (The Tower)',
  17: 'ผู้ส่องแสง (The Star)',
  18: 'ผู้ฝัน (The Moon)',
  19: 'ดวงอาทิตย์ (The Sun)',
  20: 'ผู้ตื่นรู้ (Judgement)',
  21: 'ผู้สำเร็จ (The World)',
  22: 'ผู้เริ่มใหม่ (The Innocent)',
};

// Calculate age in years from DD/MM/YYYY birth date
function calculateAge(birthDate) {
  try {
    const parts = String(birthDate).split('/');
    if (parts.length !== 3) return null;
    const d = parseInt(parts[0]);
    const m = parseInt(parts[1]);
    const y = parseInt(parts[2]);
    if (!d || !m || !y) return null;
    const today = new Date();
    let age = today.getFullYear() - y;
    const monthDiff = today.getMonth() + 1 - m;
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < d)) age--;
    if (age < 0 || age > 150) return null;
    return age;
  } catch (e) {
    return null;
  }
}

// Get current Thai date string for context
function getThaiCurrentDate() {
  const now = new Date();
  // Use Bangkok timezone (UTC+7) for accurate Thai date
  const bkk = new Date(now.getTime() + (7 * 60 * 60 * 1000));
  const thaiMonths = ['', 'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
                      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
  return `${bkk.getUTCDate()} ${thaiMonths[bkk.getUTCMonth() + 1]} ${bkk.getUTCFullYear()}`;
}

function buildSystemPrompt(archetype, birthDate, archName) {
  const archStr = archetype ? `#${archetype} ${ARCHETYPE_NAMES[archetype] || archName || ''}` : '(ยังไม่ระบุ)';
  const birthStr = birthDate || '(ยังไม่ระบุ)';
  const age = calculateAge(birthDate);
  const ageStr = age !== null ? `${age} ปี` : '(ไม่ระบุ)';
  const todayStr = getThaiCurrentDate();

  return `คุณคือผู้ช่วยของ Moome — แพลตฟอร์ม self-awareness ที่ใช้ Russian Destiny Matrix (22 archetypes ตาม Tarot Major Arcana)

วันที่ปัจจุบัน: ${todayStr}

ข้อมูลของผู้ถามรอบนี้:
- Archetype: ${archStr}
- วันเกิด: ${birthStr}
- อายุปัจจุบัน: ${ageStr}

แนวทางการตอบ:

1. **ภาษาไทยเท่านั้น — ห้ามใช้คำอังกฤษ** ในประโยค ยกเว้น:
   - ชื่อ archetype ภาษาอังกฤษในวงเล็บ ครั้งเดียวต่อคำตอบ เช่น "ผู้มองมุมต่าง (The Hanged)"
   - ชื่อทฤษฎีจิตวิทยาที่เป็น proper noun เช่น "Big Five", "MBTI" (ใส่ในวงเล็บข้างคำแปลไทย)
   - ห้ามคำเช่น overthink, motivation, archetype, decision, focus — ต้องแปลเป็นไทย: คิดมาก, แรงจูงใจ, ตัวตน, การตัดสินใจ, จดจ่อ

2. **ใช้ภาษาไทยธรรมชาติ** เหมือนคนไทยพูดกับเพื่อน ไม่แปลตรงตัวจากอังกฤษ ห้ามใช้คำแบบ:
   - "คน ๆ อื่น" → ใช้ "คนอื่น"
   - "สิ้นเปลืองพลังงาน" → ใช้ "เปลืองพลัง"
   - "วนเวียนตรงนี้" → ใช้ "ติดอยู่ตรงนี้"
   - "บรรทัดฐาน" → ใช้ "ที่สังคมคาดหวัง"
   - "Intrinsic vs Extrinsic Motivation" → ใช้ "แรงจูงใจจากภายใน vs ภายนอก"
   - "secure attachment" → ใช้ "ความผูกพันแบบมั่นคง"
   - "anxious / avoidant" → ใช้ "วิตก / หลีกเลี่ยง"

3. ตอบสั้น กระชับ ใช้น้ำเสียงอุ่น เป็นมิตร เหมือนเพื่อนที่เข้าใจศาสตร์มู
4. อ้างอิง archetype + อายุของผู้ถามตั้งแต่ประโยคแรก เช่น "ในวัย 35 + วงล้อแห่งโชค #10..."
5. ห้ามให้คำแนะนำทางการแพทย์ กฎหมาย หรือการเงินแบบเฉพาะเจาะจง — แนะนำให้ปรึกษาผู้เชี่ยวชาญแทน
6. ห้ามทำนายอนาคตแบบกำหนดได้ 100% — Moome คือ self-awareness ไม่ใช่หมอดู
7. ถ้าผู้ถามเศร้าหนัก / มีความคิดทำร้ายตัวเอง → แนะนำสายด่วนสุขภาพจิต 1323 ทันที
8. ความยาวคำตอบหลัก: 2-3 ย่อหน้า ไม่ยาว
9. ถ้าคำถามไม่เกี่ยวกับ self-awareness/ชีวิต/ความสัมพันธ์/การงาน — บอกสั้นๆ ว่าไม่ใช่ขอบเขต Moome
10. ห้ามใช้ markdown bold (** หรือ __) หรือ italic — ใช้ข้อความธรรมดาเท่านั้น
11. ถ้าผู้ถามอ้างอายุไม่ตรงกับข้อมูลด้านบน — ใช้อายุจริง อย่าทักว่าพิมพ์ผิด · เนียนๆ
12. คำว่า "Moome" หรือ "มู-มี" ใช้ได้ปกติ (เป็นชื่อแพลตฟอร์ม)
13. **สรรพนาม** ใช้แค่ 3 คำเท่านั้น — ห้ามใช้คำอื่น:
    - เรียกผู้ถาม: "คุณ" (เสมอ)
    - เรียกตัวเอง (AI): ไม่ต้องอ้าง · พูดประโยคบรรยายเลย (เช่น "เห็นว่า..." แทน "ฉันเห็นว่า...")
    - ห้ามใช้: "หม่อม", "เจ้า", "ท่าน", "เธอ", "พี่", "น้อง", "หนู", "ครับ/ค่ะ" ลงท้าย

โครงสร้างคำตอบ — ห้ามผิดเด็ดขาด ลงท้ายด้วย 4 sections นี้เสมอ:

[คำตอบหลักภาษาไทย 2-3 ย่อหน้า]

---MU---
[เสียงของศาสตร์มู · 1-2 ประโยค · ภาษาไทยล้วน · มุมจากตัวตน + พลังงาน + จังหวะชีวิต · เน้นมุมศาสตร์ตะวันออก/ตะวันตก/ Destiny Matrix]

---PSY---
[เสียงของจิตวิทยาสมัยใหม่ · 1-2 ประโยค · ภาษาไทยล้วน · ใช้แนวคิดจิตวิทยาที่แปลเป็นไทยแล้ว เช่น "บุคลิกแบบเปิดรับ (Big Five Openness)" หรือ "ความผูกพันแบบมั่นคง" · ห้ามทิ้งศัพท์อังกฤษไว้โดดๆ]

---COMPANION---
[เสียงของเพื่อนคู่คิด · 1 ประโยคเป็นคำถามชวนคิด · ภาษาไทยล้วน · ไม่บอกคำตอบ · กระตุ้นให้ user ค้นพบเอง · ขึ้นต้นด้วยคำถาม]

---SUGGEST---
mu | คำถามที่ลึกเข้าไปในมุม MU INSIGHT (5-12 คำ · เชื่อมกับ archetype/พลังงาน)
psy | คำถามที่ลึกเข้าไปในมุม PSYCHOLOGY (5-12 คำ · ขยายแนวคิดจิตวิทยา)
companion | คำถามที่ขยายมุม COMPANION (5-12 คำ · ชวนคิดต่อเชิง self-reflection)

ตัวอย่างที่ดี — ถาม "ผมควรเปลี่ยนงานไหม":

[คำตอบหลัก: ในวัย 35 + วงล้อแห่งโชค #10 คุณกำลังอยู่ในช่วงที่ตัวตนปลุกการเปลี่ยนแปลงพอดี... 2-3 ย่อหน้า ภาษาไทยล้วน]

---MU---
ตัวตน #10 วงล้อแห่งโชค คือพลังของวัฏจักร ไม่ใช่ต้องรอโชค แต่หมายว่าคุณรู้จังหวะของตัวเองดี ปี 35 มักเป็นช่วงที่วงล้อหมุนอีกรอบ ลองสังเกตว่าจังหวะภายในกำลังเรียกอะไรอยู่

---PSY---
ทฤษฎีการตัดสินใจตัวเอง (Self-determination Theory) บอกว่าความอึดอัดในงานมักเกิดจากการขาด 3 อย่าง คือ ความเป็นอิสระ ความสามารถ และความเชื่อมโยงกับคน ลองเช็ค 3 อย่างนี้ก่อนตัดสินใจเปลี่ยน

---COMPANION---
ถ้าคุณตื่นพรุ่งนี้แล้วงานนี้กลายเป็นงานในฝัน สิ่งแรกที่ต้องเปลี่ยนคืออะไร?

---SUGGEST---
mu | วงล้อแห่งโชคในวัย 35 คือวงรอบไหน?
psy | 3 ปัจจัยตัดสินใจตัวเองที่ขาดในงาน?
companion | จะรู้ได้ยังไงว่าใจพร้อมเปลี่ยนแล้ว?

จดจำว่า: คุณกำลังคุยกับคนที่อยากรู้จักตัวเองมากขึ้น · 3 voices ต้องเสริมกัน ไม่ซ้ำ · main answer ห้ามรวม 3 voices เข้าด้วยกัน`;
}

// Extract section between marker and next marker (or end)
function extractSection(text, startMarker, endMarkers) {
  const startIdx = text.indexOf(startMarker);
  if (startIdx === -1) return { content: '', remaining: text };
  let endIdx = text.length;
  for (const end of endMarkers) {
    const i = text.indexOf(end, startIdx + startMarker.length);
    if (i !== -1 && i < endIdx) endIdx = i;
  }
  const content = text.slice(startIdx + startMarker.length, endIdx).trim();
  return {
    content,
    remaining: text.slice(0, startIdx).trim(),
  };
}

// Parse Triple Voice Output + Suggestions from AI response
function parseTripleVoiceAndSuggestions(rawText) {
  const allMarkers = ['---MU---', '---PSY---', '---COMPANION---', '---SUGGEST---'];

  const sug = extractSection(rawText, '---SUGGEST---', []);
  // Parse "voice | text" format · fall back to plain text
  const validVoices = ['mu', 'psy', 'companion'];
  const suggestions = sug.content
    .split('\n')
    .map(line => line.replace(/^[-•*\d.]+\s*/, '').trim())
    .filter(line => line.length > 0 && line.length < 250)
    .map(line => {
      const m = line.match(/^(mu|psy|companion)\s*\|\s*(.+)$/i);
      if (m) {
        return { voice: m[1].toLowerCase(), text: m[2].trim() };
      }
      return { voice: null, text: line };
    })
    .filter(s => s.text.length > 0)
    .slice(0, 3);

  const companion = extractSection(sug.remaining, '---COMPANION---', allMarkers);
  const psy = extractSection(companion.remaining, '---PSY---', allMarkers);
  const mu = extractSection(psy.remaining, '---MU---', allMarkers);

  const answer = mu.remaining || sug.remaining || rawText.trim();

  return {
    answer,
    voices: {
      mu: mu.content || '',
      psy: psy.content || '',
      companion: companion.content || '',
    },
    suggestions,
  };
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

    // Authenticated user? (LINE LIFF or email magic link)
    const session = await getCurrentUser(req);

    // Rate limit
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.headers['x-real-ip'] || 'unknown';
    const safeEmail = email && email.includes('@') ? String(email).substring(0, 200).trim() : null;
    const rateLimitKey = session ? `user:${session.userId}` : getRateLimitKey(ip, safeEmail);
    const maxPerDay = session ? 100 : (safeEmail ? 50 : 5);
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
    let systemPrompt = buildSystemPrompt(archNum, birth_date, archetype_name);

    // If logged-in user, append known facts to system prompt
    if (session) {
      try {
        const facts = await getUserFacts(session.userId);
        if (facts.length > 0) {
          const factsText = facts.map(f => `- ${f.fact_key}: ${f.fact_value}`).join('\n');
          systemPrompt += `\n\nสิ่งที่ทราบเกี่ยวกับผู้ถามจากการคุยก่อนหน้า:\n${factsText}\n\nใช้ข้อมูลนี้ประกอบคำตอบโดยไม่ต้องอ้างถึงตรงๆ ว่ารู้`;
        }
      } catch (e) {
        console.warn('getUserFacts failed:', e.message);
      }
    }

    const messages = [];

    // Prefer DB history for logged-in user · fallback to client-supplied history
    let recentHistory = [];
    if (session) {
      try {
        const dbHistory = await getChatHistory(session.userId, 12); // 6 turns = 12 msgs
        recentHistory = dbHistory.map(m => ({ role: m.role, content: m.content }));
      } catch (e) {
        console.warn('getChatHistory failed:', e.message);
      }
    } else if (Array.isArray(history) && history.length > 0) {
      recentHistory = history.slice(-6);
    }

    for (const turn of recentHistory) {
      if (turn && turn.role && turn.content && (turn.role === 'user' || turn.role === 'assistant')) {
        messages.push({
          role: turn.role,
          content: String(turn.content).substring(0, 2000),
        });
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
    const rawText = data?.content?.[0]?.text || '(ไม่มีคำตอบ)';
    const { answer, voices, suggestions } = parseTripleVoiceAndSuggestions(rawText);

    // Save messages to DB (best-effort) for logged-in users
    if (session) {
      try {
        await saveChatMessage({
          userId: session.userId,
          role: 'user',
          content: safeQ,
        });
        await saveChatMessage({
          userId: session.userId,
          role: 'assistant',
          content: answer,
          voices,
          suggestions,
        });
      } catch (e) {
        console.warn('saveChatMessage failed:', e.message);
      }
    }

    return res.status(200).json({
      success: true,
      answer,
      voices,
      suggestions,
      remaining: limit.remaining,
      maxPerDay,
      isEmailUser: !!safeEmail,
      isLoggedIn: !!session,
    });
  } catch (err) {
    console.error('Ask error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal error'
    });
  }
}
