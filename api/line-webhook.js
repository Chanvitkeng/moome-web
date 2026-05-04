// POST /api/line-webhook
// LINE Messaging API webhook
// Receives events from Moome OA · routes to AI Q&A · replies with Flex Cards

import crypto from 'crypto';
import { replyMessage, pushMessage, getUserProfile, textMessage } from './_line.js';
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
// On Vercel Node.js runtime, req.body may be auto-parsed.
// We read from stream first; if already consumed, fall back to JSON.stringify(req.body).
// =====================================================
export const config = {
  api: { bodyParser: false },
};

async function readRawBody(req) {
  // Try stream first
  try {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    if (chunks.length > 0) {
      return Buffer.concat(chunks).toString('utf8');
    }
  } catch (e) {
    // stream already consumed
  }

  // Fallback: body already parsed — reconstruct
  if (req.body) {
    if (typeof req.body === 'string') return req.body;
    if (Buffer.isBuffer(req.body)) return req.body.toString('utf8');
    return JSON.stringify(req.body);
  }
  return '';
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
8. ถ้าคำถามคลุมเครือ — เดาที่เป็นไปได้สูงสุด ตอบสั้น แล้วเสนอ ---SUGGEST--- ที่ช่วยให้ระบุชัดขึ้น
9. ทุกคำตอบต้องมี 4 sections ครบถ้วน · ห้ามขาดแม้คำถามจะสั้นมาก

โครงสร้างคำตอบ — ห้ามผิดเด็ดขาด · ทุกข้อความต้องมี 4 sections นี้แม้สั้น:

[คำตอบหลัก 2 ย่อหน้า · สั้นกว่าบนเว็บเพราะใน LINE]

---MU---
[1 ประโยค · มุมศาสตร์มู · ภาษาไทย]

---PSY---
[1 ประโยค · มุมจิตวิทยา (อ้างทฤษฎีเป็นไทย)]

---COMPANION---
[1 คำถามชวนคิด · ลงท้ายด้วย ?]

---SUGGEST---
mu | คำถามต่อด้านศาสตร์ 1 (5-10 คำ)
psy | คำถามต่อด้านจิตวิทยา 1 (5-10 คำ)
companion | คำถามต่อชวนคิด 1 (5-10 คำ)

ตัวอย่างเมื่อคำถามคลุมเครือ ("เรื่องงาน"):
[คำตอบ: "ในวัย ${ageStr} + ${archName || 'ตัวตน'} เรื่องงานมีหลายแง่มุม ลองบอกเพิ่มได้ว่าตอนนี้คุณอึดอัดเรื่องอะไรเป็นพิเศษ — งานปัจจุบัน ทิศทางอาชีพ หรือความสัมพันธ์ในที่ทำงาน?"]

---MU---
ตัวตนของคุณมักให้สัญญาณผ่านความอึดอัดบางช่วง ลองสังเกตว่ามันชี้ไปทางไหนบ่อยที่สุด

---PSY---
ความอึดอัดในงานมักมาจาก 3 แหล่ง — ภายในใจ ระหว่างคน หรือสภาพแวดล้อม

---COMPANION---
ถ้าได้ตอบตรงๆ คุณจะเริ่มเล่าว่า "งานทำให้ผม..." อะไรขึ้นมาก่อน?

---SUGGEST---
mu | ตัวตนผมเหมาะสายงานแบบไหน?
psy | ทำไมผมอึดอัดในงานปัจจุบัน?
companion | งานในฝันของผมหน้าตาเป็นยังไง?`;

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

  // 2. Verify signature (skippable via env for debug)
  const signature = req.headers['x-line-signature'];
  const channelSecret = process.env.LINE_CHANNEL_SECRET;
  const skipVerify = process.env.LINE_SKIP_VERIFY === 'true';

  if (!skipVerify) {
    const valid = verifySignature(bodyStr, signature, channelSecret);
    if (!valid) {
      // Log details for debugging
      console.warn('[LINE webhook] signature mismatch', {
        hasSecret: !!channelSecret,
        hasSignature: !!signature,
        bodyLen: bodyStr.length,
        bodyPreview: bodyStr.substring(0, 100),
      });
      return res.status(401).json({ error: 'Invalid signature' });
    }
  }

  // 3. Parse events
  let body;
  try { body = JSON.parse(bodyStr); }
  catch (e) { return res.status(400).json({ error: 'Invalid JSON' }); }

  const events = body.events || [];

  // 4. Process events SYNCHRONOUSLY before responding
  // Vercel serverless terminates after response — must finish work first
  // LINE timeout = 30s · Haiku takes ~5-8s · should fit
  for (const event of events) {
    try {
      await handleEvent(event);
    } catch (err) {
      console.error('[LINE webhook] event handler error:', err);
    }
  }

  // 5. Always 200 OK to LINE
  return res.status(200).json({ ok: true, processed: events.length });
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
    console.log('[LINE webhook] message received:', text.substring(0, 50));

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
      console.log('[LINE webhook] saving birth_date:', birthDateStr, '→ archetype', archetype);
      await updateUserBirth(user.id, birthDateStr, archetype);
      console.log('[LINE webhook] birth_date saved');
      await replyMessage(event.replyToken, [birthSavedMessage(archetype, archName)]);
      return;
    }

    // 2. Need birth date before answering questions
    if (!user.birth_date) {
      console.log('[LINE webhook] user has no birth_date · asking');
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
      console.log('[LINE webhook] calling AI...');
      const t0 = Date.now();
      aiResult = await askAI({
        question: text,
        archetype,
        archName,
        birthDate: user.birth_date,
        history,
        facts,
      });
      console.log('[LINE webhook] AI responded in', Date.now() - t0, 'ms');
    } catch (err) {
      console.error('[LINE webhook] askAI failed:', err.message);
      try {
        await replyMessage(event.replyToken, [textMessage('ขออภัย AI ขัดข้องชั่วคราว · ลองใหม่ภายหลังนะครับ')]);
      } catch (e) { console.error('[LINE webhook] error reply also failed:', e.message); }
      return;
    }

    const { answer, voices, suggestions } = aiResult;
    console.log('[LINE webhook] parsed: answer len=', answer?.length, 'voices=', !!voices, 'suggestions=', suggestions?.length);

    // Fallback: default suggestions if AI didn't send any
    let finalSuggestions = suggestions;
    if (!Array.isArray(suggestions) || suggestions.length === 0) {
      finalSuggestions = [
        { voice: 'mu',        text: `${archName} เด่นด้านไหน?` },
        { voice: 'psy',       text: 'ทำไมผมรู้สึกอย่างนี้?' },
        { voice: 'companion', text: 'จุดเริ่มต้นของผมคืออะไร?' },
      ];
      console.log('[LINE webhook] using fallback suggestions');
    }

    // Save messages to DB (best-effort)
    try {
      await saveChatMessage({ userId: user.id, role: 'user', content: text });
      await saveChatMessage({ userId: user.id, role: 'assistant', content: answer, voices, suggestions: finalSuggestions });
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
    const qr = quickReplyFromSuggestions(finalSuggestions);
    if (qr && messages.length > 0) {
      const last = messages[messages.length - 1];
      // Quick Reply attaches to message · works on text/flex
      last.quickReply = qr;
    }

    // 4. Try reply first · fallback to push if reply token expired
    console.log('[LINE webhook] sending reply with', messages.length, 'messages');
    try {
      await replyMessage(event.replyToken, messages.slice(0, 5));
      console.log('[LINE webhook] reply success');
    } catch (err) {
      console.error('[LINE webhook] reply FAILED:', err.message);
      // Reply token may have expired (>30s) · use push API instead
      try {
        await pushMessage(userId, messages.slice(0, 5));
        console.log('[LINE webhook] pushMessage success (reply token expired)');
      } catch (pushErr) {
        console.error('[LINE webhook] push also failed:', pushErr.message);
        // Last resort: plain text via push
        try {
          await pushMessage(userId, [textMessage(`#${archetype} ${archName}\n\n${answer.substring(0, 1000)}`)]);
          console.log('[LINE webhook] plain text push success');
        } catch (e) {
          console.error('[LINE webhook] all reply attempts failed');
        }
      }
    }
    return;
  }

  // === Other event types: ignore ===
}
