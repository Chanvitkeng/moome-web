// POST /api/line-webhook
// LINE Messaging API webhook
// Receives events from Moome OA · routes to AI Q&A · replies with Flex Cards

import crypto from 'crypto';
import { replyMessage, getUserProfile, textMessage } from './_line.js';
import {
  heroCardWithAnswer,
  tripleVoiceCarousel,
  quickReplyFromSuggestions,
  welcomeMessage,
  askForBirthDate,
  birthSavedMessage,
} from './_line-flex.js';
import { upsertUser, getSupabase, saveChatMessage, getChatHistory, getUserFacts, updateUserBirth } from './_supabase.js';

// =====================================================
// Destiny Matrix calc — must match /calculate/ algorithm
// =====================================================
function reduceTo22(n) { while (n > 22) n -= 22; return n; }
function yearDigitSum(year) { return String(year).split('').reduce((a, b) => a + parseInt(b), 0); }
function calculateArchetype(d, m, y) {
  return reduceTo22(reduceTo22(d) + m + reduceTo22(yearDigitSum(y)));
}

const ARCHETYPE_NAMES = {
  1: 'นักสร้างสรรค์', 2: 'ผู้หยั่งรู้', 3: 'จักรพรรดินี', 4: 'ผู้สร้างฐาน',
  5: 'ครูแห่งจิตวิญญาณ', 6: 'ผู้รัก', 7: 'ผู้พิชิต', 8: 'พลังภายใน',
  9: 'ผู้แสวงหา', 10: 'วงล้อแห่งโชค', 11: 'ผู้ตัดสินด้วยใจ', 12: 'ผู้มองมุมต่าง',
  13: 'ผู้ผ่านการเปลี่ยน', 14: 'ผู้สมดุล', 15: 'ผู้ปลดพันธนาการ', 16: 'ผู้สร้างใหม่',
  17: 'ผู้ส่องแสง', 18: 'ผู้ฝัน', 19: 'ดวงอาทิตย์', 20: 'ผู้ตื่นรู้',
  21: 'ผู้สำเร็จ', 22: 'ผู้เริ่มใหม่',
};

// =====================================================
// Signature verification (LINE security requirement)
// =====================================================
function verifySignature(rawBody, signature, channelSecret) {
  if (!signature || !channelSecret) return false;
  const hash = crypto
    .createHmac('SHA256', channelSecret)
    .update(rawBody)
    .digest('base64');
  // Constant-time compare
  try {
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature));
  } catch (e) {
    return false;
  }
}

// =====================================================
// Vercel: get raw body for HMAC verify
// =====================================================
export const config = {
  api: { bodyParser: false },
};

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

// =====================================================
// Parse birth date from user text
// =====================================================
function parseBirthDate(text) {
  const m = String(text).trim().match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
  if (!m) return null;
  let [, d, mo, y] = m.map(s => parseInt(s));
  if (y > 2400) y -= 543;
  if (y < 1900 || y > 2100) return null;
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return { d, m: mo, y };
}

// =====================================================
// Calculate age
// =====================================================
function calcAge(d, m, y) {
  const today = new Date();
  let age = today.getFullYear() - y;
  const md = today.getMonth() + 1 - m;
  if (md < 0 || (md === 0 && today.getDate() < d)) age--;
  return age;
}

// =====================================================
// Call our own /api/ask logic inline (instead of HTTP)
// =====================================================
async function askAI({ question, archetype, archName, birthDate, history, facts }) {
  // Construct system prompt + call Anthropic directly
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY missing');

  const age = (() => {
    if (!birthDate) return null;
    const parts = birthDate.split('/');
    if (parts.length !== 3) return null;
    return calcAge(parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2]));
  })();

  const archStr = archetype ? `#${archetype} ${archName || ''}` : '(ยังไม่ระบุ)';
  const ageStr = age !== null ? `${age} ปี` : '(ไม่ระบุ)';
  const today = new Date();
  const todayStr = `${today.getDate()} ${['','ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'][today.getMonth()+1]} ${today.getFullYear()}`;

  let factsSection = '';
  if (Array.isArray(facts) && facts.length > 0) {
    factsSection = `\n\nสิ่งที่ทราบจากการคุยก่อนหน้า:\n${facts.map(f => `- ${f.fact_key}: ${f.fact_value}`).join('\n')}`;
  }

  const systemPrompt = `คุณคือผู้ช่วยของ Moome — แพลตฟอร์ม self-awareness ใช้ Russian Destiny Matrix

วันที่: ${todayStr}
Archetype: ${archStr}
วันเกิด: ${birthDate || '(ไม่ระบุ)'}
อายุ: ${ageStr}${factsSection}

แนวทาง:
1. ภาษาไทยล้วน · ไม่ใช้คำอังกฤษเกินจำเป็น (overthink → คิดมาก, motivation → แรงจูงใจ)
2. ตอบสั้น 2 ย่อหน้า (สำหรับแสดงใน LINE chat)
3. อ้างอิง archetype + อายุตั้งแต่ประโยคแรก
4. ห้ามให้คำแนะนำการแพทย์/กฎหมาย/การเงินเฉพาะเจาะจง
5. ถ้าผู้ถามเศร้าหนัก → แนะนำสายด่วน 1323
6. ห้าม markdown bold/italic
7. สรรพนาม: ใช้ "คุณ" เท่านั้น

โครงสร้างตอบ — ลงท้ายด้วย 4 sections เสมอ:

[คำตอบหลัก 2 ย่อหน้า · สั้นกว่าบนเว็บเพราะใน LINE]

---MU---
[1 ประโยค · มุมศาสตร์มู]

---PSY---
[1 ประโยค · มุมจิตวิทยา (อ้างทฤษฎีเป็นไทย)]

---COMPANION---
[1 คำถามชวนคิด]

---SUGGEST---
mu | คำถามต่อ 1 (5-10 คำ)
psy | คำถามต่อ 2 (5-10 คำ)
companion | คำถามต่อ 3 (5-10 คำ)`;

  const messages = [];
  if (Array.isArray(history) && history.length > 0) {
    for (const h of history.slice(-6)) {
      if (h.role && h.content) messages.push({ role: h.role, content: String(h.content).substring(0, 1500) });
    }
  }
  messages.push({ role: 'user', content: question });

  const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1200,
      system: systemPrompt,
      messages,
    }),
  });

  if (!apiRes.ok) {
    const t = await apiRes.text();
    console.error('Claude error:', t);
    throw new Error('AI service error');
  }

  const data = await apiRes.json();
  const raw = data?.content?.[0]?.text || '';
  return parseTripleVoice(raw);
}

function extractSection(text, marker, endMarkers) {
  const start = text.indexOf(marker);
  if (start === -1) return { content: '', remaining: text };
  let end = text.length;
  for (const e of endMarkers) {
    const i = text.indexOf(e, start + marker.length);
    if (i !== -1 && i < end) end = i;
  }
  return {
    content: text.slice(start + marker.length, end).trim(),
    remaining: text.slice(0, start).trim(),
  };
}

function parseTripleVoice(raw) {
  const all = ['---MU---', '---PSY---', '---COMPANION---', '---SUGGEST---'];

  const sug = extractSection(raw, '---SUGGEST---', []);
  const suggestions = sug.content.split('\n')
    .map(line => line.replace(/^[-•*\d.]+\s*/, '').trim())
    .filter(line => line && line.length < 200)
    .map(line => {
      const m = line.match(/^(mu|psy|companion)\s*\|\s*(.+)$/i);
      return m ? { voice: m[1].toLowerCase(), text: m[2].trim() } : { voice: null, text: line };
    })
    .filter(s => s.text)
    .slice(0, 3);

  const c = extractSection(sug.remaining, '---COMPANION---', all);
  const p = extractSection(c.remaining, '---PSY---', all);
  const m = extractSection(p.remaining, '---MU---', all);

  return {
    answer: (m.remaining || sug.remaining || raw).trim(),
    voices: { mu: m.content, psy: p.content, companion: c.content },
    suggestions,
  };
}

// =====================================================
// Main webhook handler
// =====================================================
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({ ok: true, message: 'LINE webhook · POST only' });
  }

  // 1. Read raw body
  const rawBody = await readRawBody(req);
  const bodyStr = rawBody.toString('utf8');

  // 2. Verify signature
  const signature = req.headers['x-line-signature'];
  const channelSecret = process.env.LINE_CHANNEL_SECRET;
  if (!verifySignature(bodyStr, signature, channelSecret)) {
    console.warn('LINE signature invalid');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // 3. Parse events
  let body;
  try { body = JSON.parse(bodyStr); }
  catch (e) { return res.status(400).json({ error: 'Invalid JSON' }); }

  const events = body.events || [];

  // Respond 200 immediately to LINE — process asynchronously
  // (Vercel functions don't have true background — but we should still try)
  res.status(200).json({ ok: true });

  // 4. Process each event (best-effort · errors logged not thrown)
  for (const event of events) {
    try {
      await handleEvent(event);
    } catch (err) {
      console.error('Event handler error:', err);
    }
  }
}

// =====================================================
// Per-event handler
// =====================================================
async function handleEvent(event) {
  const userId = event.source?.userId;
  if (!userId) return;

  const sb = getSupabase();

  // Find or create user
  let user = null;
  {
    const { data } = await sb
      .from('moome_users')
      .select('*')
      .eq('line_user_id', userId)
      .maybeSingle();
    if (data) user = data;
  }

  // === FOLLOW event (user adds Moome OA as friend) ===
  if (event.type === 'follow') {
    let displayName = null, pictureUrl = null;
    try {
      const profile = await getUserProfile(userId);
      if (profile) {
        displayName = profile.displayName;
        pictureUrl = profile.pictureUrl;
      }
    } catch (e) {}

    if (!user) {
      user = await upsertUser({
        lineUserId: userId,
        displayName,
        pictureUrl,
      });
    }

    await replyMessage(event.replyToken, [welcomeMessage()]);
    return;
  }

  // === UNFOLLOW · ignore ===
  if (event.type === 'unfollow') return;

  // === MESSAGE event ===
  if (event.type === 'message' && event.message?.type === 'text') {
    const text = String(event.message.text || '').trim();
    if (!text) return;

    // Auto-create user if first message (no follow event captured)
    if (!user) {
      let displayName = null, pictureUrl = null;
      try {
        const profile = await getUserProfile(userId);
        if (profile) { displayName = profile.displayName; pictureUrl = profile.pictureUrl; }
      } catch (e) {}
      user = await upsertUser({ lineUserId: userId, displayName, pictureUrl });
    }

    // 1. Check if user is sending a birth date
    const birth = parseBirthDate(text);
    if (birth) {
      const archetype = calculateArchetype(birth.d, birth.m, birth.y);
      const archName = ARCHETYPE_NAMES[archetype] || '—';
      const birthDateStr = `${birth.d}/${birth.m}/${birth.y}`;
      await updateUserBirth(user.id, birthDateStr, archetype);
      await replyMessage(event.replyToken, [birthSavedMessage(archetype, archName)]);
      return;
    }

    // 2. Need birth date before answering questions
    if (!user.birth_date) {
      await replyMessage(event.replyToken, [askForBirthDate()]);
      return;
    }

    // 3. Process as a question — call AI
    const archetype = user.archetype;
    const archName = ARCHETYPE_NAMES[archetype] || '—';

    let history = [];
    let facts = [];
    try {
      [history, facts] = await Promise.all([
        getChatHistory(user.id, 8),
        getUserFacts(user.id),
      ]);
    } catch (e) { console.warn('history/facts fetch failed:', e); }

    let aiResult;
    try {
      aiResult = await askAI({
        question: text,
        archetype,
        archName,
        birthDate: user.birth_date,
        history,
        facts,
      });
    } catch (err) {
      console.error('askAI failed:', err);
      await replyMessage(event.replyToken, [textMessage('ขออภัย AI ขัดข้องชั่วคราว · ลองใหม่ภายหลังนะครับ')]);
      return;
    }

    const { answer, voices, suggestions } = aiResult;

    // Save messages to DB (best-effort)
    try {
      await saveChatMessage({ userId: user.id, role: 'user', content: text });
      await saveChatMessage({ userId: user.id, role: 'assistant', content: answer, voices, suggestions });
    } catch (e) { console.warn('saveChatMessage failed:', e); }

    // Build reply messages
    const messages = [];

    // 1. Hero card with main answer
    messages.push(heroCardWithAnswer({
      archetype,
      archName,
      age: (() => {
        if (!user.birth_date) return null;
        const [d, m, y] = user.birth_date.split('/').map(s => parseInt(s));
        return calcAge(d, m, y);
      })(),
      mainAnswer: answer.length > 600 ? answer.substring(0, 580) + '...' : answer,
    }));

    // 2. Triple voice carousel (if any voices present)
    const carousel = tripleVoiceCarousel(voices);
    if (carousel) {
      messages.push(carousel);
    }

    // 3. Quick Reply attached to last message
    const qr = quickReplyFromSuggestions(suggestions);
    if (qr && messages.length > 0) {
      const last = messages[messages.length - 1];
      // Quick Reply attaches to message · works on text/flex
      last.quickReply = qr;
    }

    // 4. Send reply (max 5 messages)
    await replyMessage(event.replyToken, messages.slice(0, 5));
    return;
  }

  // === Other event types: ignore ===
}
