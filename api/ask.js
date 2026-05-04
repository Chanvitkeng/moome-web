// Vercel Function · POST /api/ask
// User asks a question → Claude Haiku answers with archetype context
// Server-side rate limit: 5/day per IP for anonymous · 50/day if email provided

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 1400;

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
1. ตอบเป็นภาษาไทยเสมอ (ใช้ภาษาไทยล้วน · ไม่ผสมอังกฤษเกินจำเป็น · ใช้คำธรรมดา ไม่หรูเกิน)
2. ตอบสั้น กระชับ ใช้น้ำเสียงอุ่น เป็นมิตร เหมือนเพื่อนที่เข้าใจศาสตร์มู
3. อ้างอิง archetype + อายุของผู้ถามตั้งแต่ประโยคแรก (proactive ไม่ต้องรอผู้ถามอ้าง) เช่น "ในวัย 35 ปี + วงล้อโชค #10..."
4. ห้ามให้คำแนะนำทางการแพทย์ กฎหมาย หรือการเงินแบบเฉพาะเจาะจง — แนะนำให้ปรึกษาผู้เชี่ยวชาญแทน
5. ห้ามทำนายอนาคตแบบกำหนดได้ 100% — Moome คือ self-awareness ไม่ใช่หมอดู
6. ถ้าผู้ถามเศร้าหนัก / มีความคิดทำร้ายตัวเอง → แนะนำสายด่วนสุขภาพจิต 1323 (กรมสุขภาพจิต) ทันทีและไม่หาเหตุผล
7. ความยาวคำตอบหลัก: 2-3 ย่อหน้า ไม่ยาว
8. ถ้าคำถามไม่เกี่ยวกับ self-awareness/ชีวิต/ความสัมพันธ์/การงาน — ตอบสั้นๆ ว่าไม่ใช่ขอบเขต Moome และเสนอให้ถามเรื่องที่เกี่ยวข้อง
9. ห้ามใช้ markdown bold (** หรือ __) หรือ italic ในคำตอบ — ใช้ข้อความธรรมดาเท่านั้น (UI ไม่ render markdown)
10. ถ้าผู้ถามอ้างอายุที่ไม่ตรงกับข้อมูลด้านบน — ใช้ข้อมูลด้านบน (ที่คำนวณจากวันเกิด) ไม่ต้องบอกว่าผู้ถามพิมพ์ผิด · เนียนๆ ใช้อายุจริง

โครงสร้างคำตอบ — ห้ามผิดเด็ดขาด ลงท้ายด้วย 4 sections นี้เสมอ:

[คำตอบหลัก 2-3 ย่อหน้า]

---MU---
[เสียงของศาสตร์มู · 1-2 ประโยค · มุมจาก Destiny Matrix archetype + พลังงาน + จังหวะชีวิต · เน้นมุมศาสตร์ตะวันออก/ตะวันตก]

---PSY---
[เสียงของจิตวิทยาสมัยใหม่ · 1-2 ประโยค · อ้าง concept psychology ที่เกี่ยวข้อง เช่น Big Five (Openness/Conscientiousness), MBTI (T/F, J/P), Cognitive Bias, Attachment Style, Self-determination theory ฯลฯ · ให้ practical insight]

---COMPANION---
[เสียงของเพื่อนคู่คิด · 1 ประโยคเป็นคำถามชวนคิด · ไม่บอกคำตอบ · กระตุ้นให้ user ค้นพบเอง · ขึ้นต้นด้วยคำถาม]

---SUGGEST---
- คำถามต่อข้อ 1 (สั้น 5-12 คำ · ลึกในประเด็นเดิม)
- คำถามต่อข้อ 2 (สั้น 5-12 คำ · มุมที่เกี่ยวข้องแต่ขยับ)
- คำถามต่อข้อ 3 (สั้น 5-12 คำ · เชื่อม archetype หรือชีวิต)

ตัวอย่างที่ดี — ถาม "ผมควรเปลี่ยนงานไหม":

[คำตอบหลัก: ในวัย 35 + วงล้อโชค #10 คุณอยู่ในช่วงที่ archetype ปลุกความเปลี่ยนพอดี... 2-3 ย่อหน้า]

---MU---
ใน Destiny Matrix #10 วงล้อโชค คือพลังของวัฏจักร ไม่ใช่หมายความว่าต้องรอโชค แต่หมายว่าคุณรู้จังหวะของตัวเองดี ปี 35 มักเป็นช่วงที่วงล้อหมุนอีกรอบ

---PSY---
จากกรอบ Self-determination Theory ความอึดอัดในงานบางครั้งบอกว่ามี autonomy / competence / relatedness ที่ขาด ลองเช็ค 3 อันนี้ก่อนตัดสินใจเปลี่ยน

---COMPANION---
ถ้าคุณตื่นพรุ่งนี้แล้วงานนี้กลายเป็นงานในฝัน อะไรคือสิ่งที่ต้องเปลี่ยนเป็นอันดับแรก?

---SUGGEST---
- 3 หลักจิตวิทยาที่ควรเช็คก่อนเปลี่ยนงาน?
- วงล้อโชคในวัย 35 คือวงรอบไหน?
- ทำยังไงให้ทำใจได้ว่าจะลาออก?

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
  const suggestions = sug.content
    .split('\n')
    .map(line => line.replace(/^[-•*\d.]+\s*/, '').trim())
    .filter(line => line.length > 0 && line.length < 200)
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
    const rawText = data?.content?.[0]?.text || '(ไม่มีคำตอบ)';
    const { answer, voices, suggestions } = parseTripleVoiceAndSuggestions(rawText);

    return res.status(200).json({
      success: true,
      answer,
      voices,
      suggestions,
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
