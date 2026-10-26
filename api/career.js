// Vercel Function · POST /api/career
// Input: { year, month, day }
// Output: 4-system convergence result (see _career-data.js)

import { computeConvergence } from './_career-data.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://moome.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  try {
    const { year, month, day } = req.body || {};

    const y = parseInt(year, 10);
    const m = parseInt(month, 10);
    const d = parseInt(day, 10);

    if (!y || !m || !d) {
      return res.status(400).json({ success: false, error: 'กรุณาระบุ year/month/day' });
    }
    if (y < 1900 || y > 2100) {
      return res.status(400).json({ success: false, error: 'ปีไม่ถูกต้อง' });
    }
    if (m < 1 || m > 12 || d < 1 || d > 31) {
      return res.status(400).json({ success: false, error: 'เดือน/วัน ไม่ถูกต้อง' });
    }

    const result = computeConvergence({ year: y, month: m, day: d });

    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    console.error('career error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Internal error' });
  }
}
