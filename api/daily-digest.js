// GET /api/daily-digest
// Triggered by Vercel Cron at midnight Bangkok time (17:00 UTC)
// Generates summary of last 24h activity + recommendations · sends to admin

import { Resend } from 'resend';
import { getSupabase } from './_supabase.js';

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = 'chanvit.kasetpiban@gmail.com';

// =====================================================
// Fetch metrics from Supabase
// =====================================================
async function fetchMetrics() {
  const sb = getSupabase();
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const yesterdayIso = yesterday.toISOString();

  const [
    { count: totalUsers },
    { count: newUsers24h },
    { count: totalMessages },
    { count: messages24h },
    { data: recentMessages },
    { count: totalFacts },
    { count: totalWebhooks },
  ] = await Promise.all([
    sb.from('moome_users').select('*', { count: 'exact', head: true }),
    sb.from('moome_users').select('*', { count: 'exact', head: true }).gte('created_at', yesterdayIso),
    sb.from('moome_chat_messages').select('*', { count: 'exact', head: true }),
    sb.from('moome_chat_messages').select('*', { count: 'exact', head: true }).gte('created_at', yesterdayIso),
    sb.from('moome_chat_messages')
      .select('role, content, created_at')
      .gte('created_at', yesterdayIso)
      .order('created_at', { ascending: false })
      .limit(20),
    sb.from('moome_user_facts').select('*', { count: 'exact', head: true }),
    sb.from('moome_webhook_events')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', yesterdayIso),
  ]);

  // Top archetypes
  const { data: archetypeData } = await sb
    .from('moome_users')
    .select('archetype')
    .not('archetype', 'is', null);
  const archCounts = {};
  for (const u of archetypeData || []) {
    archCounts[u.archetype] = (archCounts[u.archetype] || 0) + 1;
  }
  const topArchetypes = Object.entries(archCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // User segmentation
  const { count: lineUsers } = await sb
    .from('moome_users')
    .select('*', { count: 'exact', head: true })
    .not('line_user_id', 'is', null);
  const { count: emailOnlyUsers } = await sb
    .from('moome_users')
    .select('*', { count: 'exact', head: true })
    .is('line_user_id', null)
    .not('email', 'is', null);

  return {
    totalUsers: totalUsers || 0,
    newUsers24h: newUsers24h || 0,
    totalMessages: totalMessages || 0,
    messages24h: messages24h || 0,
    recentMessages: recentMessages || [],
    totalFacts: totalFacts || 0,
    webhookEvents24h: totalWebhooks || 0,
    topArchetypes,
    lineUsers: lineUsers || 0,
    emailOnlyUsers: emailOnlyUsers || 0,
  };
}

// =====================================================
// Fetch Microsoft Clarity Data Export API
// Free tier: 10 requests/day · 3 days lookback · 3 dimensions/request
// Docs: https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-data-export-api
// =====================================================
async function fetchClarity(numOfDays = 1, dimensions = ['URL']) {
  const token = process.env.CLARITY_API_TOKEN;
  if (!token) return null;

  const url = new URL('https://www.clarity.ms/export-data/api/v1/project-live-insights');
  url.searchParams.set('numOfDays', String(numOfDays));
  dimensions.forEach((d, i) => {
    if (d) url.searchParams.set(`dimension${i + 1}`, d);
  });

  try {
    const res = await fetch(url.toString(), {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) {
      console.warn('[clarity] fetch failed:', res.status, await res.text());
      return null;
    }
    return await res.json();
  } catch (e) {
    console.error('[clarity] error:', e.message);
    return null;
  }
}

// Parse Clarity response into a clean shape
function parseClarityMetrics(data) {
  if (!Array.isArray(data) || data.length === 0) return null;

  const metrics = {};
  for (const m of data) {
    const name = m.metricName;
    const info = Array.isArray(m.information) ? m.information : [];
    metrics[name] = info;
  }

  // Extract common ones we care about
  const result = {
    sessions: 0,
    bounceRate: null,
    avgScrollDepth: null,
    pagesPerSession: null,
    rageClicks: 0,
    deadClicks: 0,
    quickBacks: 0,
    excessiveScrolls: 0,
    topUrls: [],
    raw: metrics,
  };

  const traffic = metrics.Traffic?.[0];
  if (traffic) {
    result.sessions = parseInt(traffic.totalSessionCount) || 0;
    result.bounceRate = parseFloat(traffic.botSessionCount) || null;
    result.pagesPerSession = parseFloat(traffic.distinctUserCount) || null;
  }

  // Engagement metrics
  const engagement = metrics.EngagementTime?.[0];
  if (engagement) {
    result.avgScrollDepth = parseFloat(engagement.activeTime) || null;
  }

  // Friction metrics — array of URL → count
  const rageList = metrics.RageClickCount || [];
  result.rageClicks = rageList.reduce((sum, x) => sum + (parseInt(x.subTotal) || 0), 0);

  const deadList = metrics.DeadClickCount || [];
  result.deadClicks = deadList.reduce((sum, x) => sum + (parseInt(x.subTotal) || 0), 0);

  const quickBackList = metrics.QuickbackClick || [];
  result.quickBacks = quickBackList.reduce((sum, x) => sum + (parseInt(x.subTotal) || 0), 0);

  const scrollList = metrics.ExcessiveScroll || [];
  result.excessiveScrolls = scrollList.reduce((sum, x) => sum + (parseInt(x.subTotal) || 0), 0);

  // Top URLs from Traffic.PagePath dimension
  if (traffic && Array.isArray(metrics.Traffic)) {
    result.topUrls = metrics.Traffic
      .map(t => ({
        url: t.URL || t.PagePath || '(unknown)',
        sessions: parseInt(t.totalSessionCount) || 0,
      }))
      .filter(t => t.sessions > 0)
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 5);
  }

  return result;
}

// =====================================================
// AI-generated insights from metrics
// =====================================================
async function generateInsights(metrics) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const prompt = `คุณคือ data analyst ให้ Moome — แพลตฟอร์ม self-awareness ที่ใช้ AI Q&A + Russian Destiny Matrix

ข้อมูล 24 ชั่วโมงล่าสุด:
- ผู้ใช้ใหม่: ${metrics.newUsers24h} คน (รวมทั้งหมด ${metrics.totalUsers})
- ข้อความแชท: ${metrics.messages24h} ข้อความ (รวมทั้งหมด ${metrics.totalMessages})
- LINE users: ${metrics.lineUsers} · Email-only: ${metrics.emailOnlyUsers}
- Webhook events: ${metrics.webhookEvents24h}
- Top archetypes: ${metrics.topArchetypes.map(([a, c]) => `#${a} (${c})`).join(', ')}

ตัวอย่างคำถามล่าสุด (สูงสุด 10):
${metrics.recentMessages.filter(m => m.role === 'user').slice(0, 10).map(m => `- "${m.content.substring(0, 80)}"`).join('\n')}

ให้สรุป 3 ส่วน (ภาษาไทยล้วน):

1. **สถานะวันนี้** (3-4 ประโยค) — เน้น highlight สำคัญ + เปรียบเทียบ trend
2. **สิ่งที่น่าสังเกต** (2-3 bullets) — pattern ที่เห็น เช่น คำถามซ้ำๆ, กลุ่ม archetype ที่ใช้เยอะ, ปัญหา UX
3. **แนะนำให้ทำพรุ่งนี้** (2-3 bullets · concrete action) — ไม่ใช่ general advice

ห้ามใช้ markdown bullet (-, *) — ใช้ตัวเลข 1. 2. 3.`;

  try {
    const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    if (!apiRes.ok) return null;
    const data = await apiRes.json();
    return data?.content?.[0]?.text || null;
  } catch (e) {
    console.error('insights gen failed:', e);
    return null;
  }
}

// =====================================================
// Build email HTML
// =====================================================
function buildDigestHTML(metrics, insights, dateStr, clarity) {
  const PLUM = '#3d2c4e';
  const GOLD = '#c9a961';
  const CREAM = '#F5EFE6';
  const ROSE = '#b97a8b';
  const SAGE = '#8aa888';

  const archetypeRows = metrics.topArchetypes
    .map(([num, count]) => `<tr><td>#${num}</td><td>${count} คน</td></tr>`)
    .join('');

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:${CREAM};font-family:'Helvetica Neue',Arial,sans-serif;color:#0f0a1e;line-height:1.7;">
<div style="max-width:600px;margin:0 auto;padding:32px 16px;">

  <div style="text-align:center;padding:24px 0;">
    <div style="font-size:13px;letter-spacing:0.32em;color:${GOLD};font-weight:700;">✦ MOOME · DAILY DIGEST</div>
    <div style="font-size:13px;color:#888;margin-top:6px;">${dateStr}</div>
  </div>

  <!-- Metrics card -->
  <div style="background:white;border-radius:18px;padding:24px;margin:18px 0;border:1px solid rgba(61,44,78,0.08);">
    <h2 style="font-size:18px;color:${PLUM};margin-bottom:14px;">📊 ตัวเลข 24 ชม.</h2>
    <table style="width:100%;font-size:14.5px;color:#333;">
      <tr><td style="padding:6px 0;color:#666;">ผู้ใช้ใหม่</td><td style="text-align:right;font-weight:700;">${metrics.newUsers24h}</td></tr>
      <tr><td style="padding:6px 0;color:#666;">ผู้ใช้ทั้งหมด</td><td style="text-align:right;font-weight:700;">${metrics.totalUsers}</td></tr>
      <tr><td style="padding:6px 0;color:#666;">ข้อความแชท 24 ชม.</td><td style="text-align:right;font-weight:700;">${metrics.messages24h}</td></tr>
      <tr><td style="padding:6px 0;color:#666;">ข้อความสะสมทั้งหมด</td><td style="text-align:right;font-weight:700;">${metrics.totalMessages}</td></tr>
      <tr><td style="padding:6px 0;color:#666;">LINE users</td><td style="text-align:right;font-weight:700;">${metrics.lineUsers}</td></tr>
      <tr><td style="padding:6px 0;color:#666;">Email-only users</td><td style="text-align:right;font-weight:700;">${metrics.emailOnlyUsers}</td></tr>
      <tr><td style="padding:6px 0;color:#666;">Webhook events</td><td style="text-align:right;font-weight:700;">${metrics.webhookEvents24h}</td></tr>
    </table>
  </div>

  ${metrics.topArchetypes.length > 0 ? `
  <div style="background:white;border-radius:18px;padding:24px;margin:18px 0;border:1px solid rgba(61,44,78,0.08);">
    <h2 style="font-size:18px;color:${PLUM};margin-bottom:14px;">🏆 Top Archetypes</h2>
    <table style="width:100%;font-size:14.5px;color:#333;">${archetypeRows}</table>
  </div>` : ''}

  ${clarity ? `
  <div style="background:white;border-radius:18px;padding:24px;margin:18px 0;border:1px solid rgba(61,44,78,0.08);">
    <h2 style="font-size:18px;color:${PLUM};margin-bottom:14px;">📊 Web Analytics (Clarity)</h2>
    <table style="width:100%;font-size:14.5px;color:#333;">
      <tr><td style="padding:6px 0;color:#666;">Sessions</td><td style="text-align:right;font-weight:700;">${clarity.sessions}</td></tr>
      ${clarity.pagesPerSession !== null ? `<tr><td style="padding:6px 0;color:#666;">Distinct users</td><td style="text-align:right;font-weight:700;">${clarity.pagesPerSession}</td></tr>` : ''}
      ${clarity.avgScrollDepth !== null ? `<tr><td style="padding:6px 0;color:#666;">Avg active time</td><td style="text-align:right;font-weight:700;">${clarity.avgScrollDepth} sec</td></tr>` : ''}
    </table>

    ${clarity.rageClicks + clarity.deadClicks + clarity.quickBacks + clarity.excessiveScrolls > 0 ? `
    <div style="margin-top:16px;padding-top:14px;border-top:1px solid rgba(61,44,78,0.08);">
      <div style="font-size:12px;letter-spacing:0.18em;color:${ROSE};font-weight:700;text-transform:uppercase;margin-bottom:8px;">⚠ Friction Points</div>
      <table style="width:100%;font-size:14px;color:#333;">
        ${clarity.rageClicks > 0 ? `<tr><td style="padding:4px 0;color:#666;">Rage clicks</td><td style="text-align:right;font-weight:700;color:${ROSE};">${clarity.rageClicks}</td></tr>` : ''}
        ${clarity.deadClicks > 0 ? `<tr><td style="padding:4px 0;color:#666;">Dead clicks</td><td style="text-align:right;font-weight:700;color:${ROSE};">${clarity.deadClicks}</td></tr>` : ''}
        ${clarity.quickBacks > 0 ? `<tr><td style="padding:4px 0;color:#666;">Quick backs</td><td style="text-align:right;font-weight:700;color:${ROSE};">${clarity.quickBacks}</td></tr>` : ''}
        ${clarity.excessiveScrolls > 0 ? `<tr><td style="padding:4px 0;color:#666;">Excessive scrolls</td><td style="text-align:right;font-weight:700;color:${ROSE};">${clarity.excessiveScrolls}</td></tr>` : ''}
      </table>
    </div>` : ''}

    ${clarity.topUrls && clarity.topUrls.length > 0 ? `
    <div style="margin-top:16px;padding-top:14px;border-top:1px solid rgba(61,44,78,0.08);">
      <div style="font-size:12px;letter-spacing:0.18em;color:${GOLD};font-weight:700;text-transform:uppercase;margin-bottom:8px;">🔥 Top Pages</div>
      <table style="width:100%;font-size:13.5px;color:#333;">
        ${clarity.topUrls.map(u => `<tr><td style="padding:4px 0;color:#666;font-family:monospace;font-size:12.5px;">${u.url}</td><td style="text-align:right;font-weight:700;">${u.sessions}</td></tr>`).join('')}
      </table>
    </div>` : ''}

    <p style="margin-top:14px;font-size:11.5px;color:#999;">📹 <a href="https://clarity.microsoft.com/projects/view/wl6ny59pz0/dashboard" style="color:${GOLD};">ดู recordings เต็มใน Clarity</a></p>
  </div>` : ''}

  ${insights ? `
  <div style="background:linear-gradient(135deg,#fffbf2,#fef5e1);border-radius:18px;padding:24px;margin:18px 0;border:1px solid rgba(201,169,97,0.25);">
    <h2 style="font-size:18px;color:${PLUM};margin-bottom:14px;">🔍 AI วิเคราะห์</h2>
    <div style="font-size:14.5px;color:#333;white-space:pre-wrap;">${insights.replace(/\n/g, '<br>')}</div>
  </div>` : ''}

  <div style="text-align:center;padding:24px 0;color:#888;font-size:12px;">
    <p>Moome · Daily Digest auto-sent every midnight</p>
    <p>📊 <a href="https://vercel.com/kengs-projects-3e8269a6/moome-web/analytics" style="color:${GOLD};">Vercel Analytics</a> · 🔥 <a href="https://clarity.microsoft.com" style="color:${GOLD};">Microsoft Clarity</a></p>
  </div>

</div>
</body></html>`;
}

// =====================================================
// Main handler
// =====================================================
export default async function handler(req, res) {
  // Optional: secure with cron secret to prevent random triggers
  const cronSecret = process.env.CRON_SECRET;
  const auth = req.headers.authorization;
  if (cronSecret && auth !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const [metrics, clarityRaw] = await Promise.all([
      fetchMetrics(),
      fetchClarity(1, ['URL']),
    ]);
    const clarity = parseClarityMetrics(clarityRaw);
    const insights = await generateInsights(metrics);

    const today = new Date();
    const dateStr = today.toLocaleDateString('th-TH', {
      timeZone: 'Asia/Bangkok',
      day: 'numeric', month: 'long', year: 'numeric'
    });

    const html = buildDigestHTML(metrics, insights, dateStr, clarity);

    const result = await resend.emails.send({
      from: 'Moome Daily <hello@moome.app>',
      to: ADMIN_EMAIL,
      subject: `📊 Moome Daily Digest · ${dateStr} · ${metrics.newUsers24h} ผู้ใช้ใหม่`,
      html,
    });

    return res.status(200).json({
      success: true,
      sent: !!result.data?.id,
      metrics: {
        newUsers24h: metrics.newUsers24h,
        messages24h: metrics.messages24h,
        totalUsers: metrics.totalUsers,
      },
    });
  } catch (err) {
    console.error('daily digest error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
