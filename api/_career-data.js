// =====================================================
// Career Convergence Engine — Data Mapping
// Version: MVP (date-only, 70% accuracy target)
// =====================================================
// 4 systems vote on 20 career clusters.
// Clusters with 4 votes = Soul Calling · 3 = Strong · 2 = Supporting
// =====================================================

// =====================================================
// 20 Career Clusters
// Each has: Thai label · English · emoji · specific jobs
// =====================================================
export const CLUSTERS = {
  teacher: {
    th: 'ครู · ผู้นำทาง',
    en: 'Teacher / Mentor',
    icon: '📚',
    jobs: ['ครู · อาจารย์', 'Trainer · นักพัฒนาองค์กร', 'Life Coach', 'Content Creator ที่สอน', 'Professor', 'หัวหน้าทีมที่ mentor'],
  },
  healer: {
    th: 'ผู้เยียวยา',
    en: 'Healer / Therapist',
    icon: '🌿',
    jobs: ['Therapist · Counselor', 'นักจิตวิทยา', 'พยาบาล · แพทย์', 'Wellness Coach', 'Massage Therapist', 'นักสังคมสงเคราะห์'],
  },
  creator: {
    th: 'ผู้สร้างสรรค์',
    en: 'Creator / Artist',
    icon: '🎨',
    jobs: ['Artist · นักออกแบบ', 'Writer · นักเขียน', 'นักดนตรี', 'Filmmaker', 'Illustrator', 'Content Creator'],
  },
  leader: {
    th: 'ผู้นำ · ผู้ก่อตั้ง',
    en: 'Leader / Founder',
    icon: '👑',
    jobs: ['CEO · Executive', 'Founder · Entrepreneur', 'Manager · Director', 'Head of Department', 'ผู้นำองค์กร'],
  },
  builder: {
    th: 'ผู้สร้างระบบ',
    en: 'Builder / Engineer',
    icon: '🏗️',
    jobs: ['Engineer · วิศวกร', 'Architect · สถาปนิก', 'Operations Director', 'Product Manager', 'ช่างฝีมือ', 'Technician'],
  },
  analyst: {
    th: 'ผู้วิเคราะห์',
    en: 'Analyst / Researcher',
    icon: '🔬',
    jobs: ['นักวิจัย', 'Data Scientist · Analyst', 'นักเศรษฐศาสตร์', 'นักวิทยาศาสตร์', 'Consultant', 'Investigator'],
  },
  communicator: {
    th: 'ผู้สื่อสาร',
    en: 'Communicator',
    icon: '🎙️',
    jobs: ['Journalist', 'Writer · Copywriter', 'PR · Communication', 'Public Speaker', 'Podcaster', 'Marketing'],
  },
  strategist: {
    th: 'ผู้วางกลยุทธ์',
    en: 'Strategist / Consultant',
    icon: '♟️',
    jobs: ['Strategy Consultant', 'Business Advisor', 'Chief Strategy Officer', 'Investment Analyst', 'Military Strategist', 'Management Consultant'],
  },
  service: {
    th: 'ผู้บริการ',
    en: 'Service / Hospitality',
    icon: '🫖',
    jobs: ['Hotel Manager', 'Chef · Restaurateur', 'Concierge', 'Service Designer', 'Customer Success', 'Event Planner'],
  },
  justice: {
    th: 'ผู้ตัดสินด้วยธรรม',
    en: 'Justice / Mediator',
    icon: '⚖️',
    jobs: ['ทนายความ · ผู้พิพากษา', 'Mediator', 'HR · OD', 'Compliance Officer', 'Ethics Advisor', 'Diplomat'],
  },
  innovator: {
    th: 'ผู้บุกเบิก',
    en: 'Innovator / Entrepreneur',
    icon: '💡',
    jobs: ['Startup Founder', 'Inventor', 'R&D Lead', 'Product Innovator', 'Venture Builder', 'Pioneer'],
  },
  nurturer: {
    th: 'ผู้ดูแล',
    en: 'Nurturer / Caregiver',
    icon: '🤱',
    jobs: ['พยาบาล', 'ครูอนุบาล', 'HR · People Operations', 'Caregiver', 'Doula · ผดุงครรภ์', 'Social Worker'],
  },
  explorer: {
    th: 'ผู้สำรวจ',
    en: 'Explorer / Pioneer',
    icon: '🧭',
    jobs: ['นักข่าว', 'นักท่องเที่ยว · Guide', 'Field Researcher', 'Journalist', 'Anthropologist', 'Travel Writer'],
  },
  transformer: {
    th: 'ผู้นำการเปลี่ยนแปลง',
    en: 'Transformer / Change Agent',
    icon: '🦋',
    jobs: ['Change Management Consultant', 'Life Coach', 'Therapist', 'Reinvention Specialist', 'Grief Counselor', 'Executive Coach'],
  },
  beauty: {
    th: 'ผู้สร้างความงาม',
    en: 'Beauty / Aesthetic',
    icon: '🌹',
    jobs: ['Fashion Designer', 'Interior Designer', 'Wedding Planner', 'Stylist · Makeup Artist', 'Florist', 'Brand Designer'],
  },
  performer: {
    th: 'ผู้แสดง · ผู้ประกาศ',
    en: 'Performer / Entertainer',
    icon: '🎭',
    jobs: ['นักแสดง', 'นักดนตรี', 'Public Speaker', 'MC · Host', 'Comedian', 'นักร้อง'],
  },
  spiritual: {
    th: 'ผู้นำทางจิตวิญญาณ',
    en: 'Spiritual Guide',
    icon: '🕉️',
    jobs: ['พระ · นักปฏิบัติ', 'Spiritual Teacher', 'Meditation Coach', 'Energy Healer', 'Astrologer · ผู้ทำนาย', 'Yoga Teacher'],
  },
  finance: {
    th: 'ผู้ดูแลการเงิน',
    en: 'Finance / Wealth',
    icon: '💰',
    jobs: ['Financial Planner', 'Investment Analyst', 'Trader', 'Accountant', 'Wealth Manager', 'CFO'],
  },
  tech: {
    th: 'ผู้สร้างเทคโนโลยี',
    en: 'Technology / Data',
    icon: '⚙️',
    jobs: ['Software Engineer', 'Data Scientist', 'AI Researcher', 'Cybersecurity', 'DevOps', 'Tech Lead'],
  },
  protector: {
    th: 'ผู้พิทักษ์',
    en: 'Protector / Guardian',
    icon: '🛡️',
    jobs: ['ทหาร · ตำรวจ', 'Firefighter', 'Security Expert', 'Lifeguard', 'Social Worker', 'Advocate'],
  },
};

// =====================================================
// System 1: Destiny Matrix (22 archetypes)
// Based on: 22 archetype articles + /calculate/ existing logic
// Each archetype votes for 4 career clusters
// =====================================================
export const DESTINY_MAP = {
  1:  { name: 'นักสร้างสรรค์', en: 'The Magician', clusters: ['creator', 'innovator', 'leader', 'communicator'] },
  2:  { name: 'ผู้หยั่งรู้', en: 'The High Priestess', clusters: ['healer', 'spiritual', 'teacher', 'analyst'] },
  3:  { name: 'จักรพรรดินี', en: 'The Empress', clusters: ['nurturer', 'creator', 'beauty', 'service'] },
  4:  { name: 'ผู้สร้างฐาน', en: 'The Emperor', clusters: ['leader', 'builder', 'strategist', 'justice'] },
  5:  { name: 'ครูแห่งจิตวิญญาณ', en: 'The Hierophant', clusters: ['teacher', 'spiritual', 'communicator', 'strategist'] },
  6:  { name: 'ผู้รักลึก', en: 'The Lovers', clusters: ['healer', 'beauty', 'creator', 'service'] },
  7:  { name: 'ผู้พิชิต', en: 'The Chariot', clusters: ['leader', 'explorer', 'protector', 'innovator'] },
  8:  { name: 'พลังภายใน', en: 'Strength', clusters: ['protector', 'leader', 'transformer', 'healer'] },
  9:  { name: 'ผู้แสวงหา', en: 'The Hermit', clusters: ['analyst', 'spiritual', 'teacher', 'explorer'] },
  10: { name: 'วงล้อแห่งโชค', en: 'Wheel of Fortune', clusters: ['transformer', 'strategist', 'finance', 'innovator'] },
  11: { name: 'ผู้ตัดสินด้วยใจ', en: 'Justice', clusters: ['justice', 'strategist', 'analyst', 'leader'] },
  12: { name: 'ผู้มองมุมต่าง', en: 'The Hanged', clusters: ['innovator', 'spiritual', 'analyst', 'transformer'] },
  13: { name: 'ผู้ผ่านการเปลี่ยน', en: 'Death', clusters: ['transformer', 'healer', 'teacher', 'innovator'] },
  14: { name: 'ผู้สมดุล', en: 'Temperance', clusters: ['healer', 'transformer', 'justice', 'teacher'] },
  15: { name: 'ผู้รู้แรงดึงดูด', en: 'The Devil', clusters: ['innovator', 'strategist', 'communicator', 'finance'] },
  16: { name: 'ผู้สร้างใหม่', en: 'The Tower', clusters: ['innovator', 'transformer', 'leader', 'explorer'] },
  17: { name: 'ผู้ส่องแสง', en: 'The Star', clusters: ['creator', 'communicator', 'spiritual', 'healer'] },
  18: { name: 'ผู้ฝัน', en: 'The Moon', clusters: ['creator', 'spiritual', 'healer', 'analyst'] },
  19: { name: 'ดวงอาทิตย์', en: 'The Sun', clusters: ['communicator', 'performer', 'leader', 'teacher'] },
  20: { name: 'ผู้ตื่นรู้', en: 'Judgement', clusters: ['transformer', 'communicator', 'spiritual', 'teacher'] },
  21: { name: 'ผู้บูรณาการ', en: 'The World', clusters: ['strategist', 'leader', 'teacher', 'creator'] },
  22: { name: 'ผู้เริ่มใหม่', en: 'The Fool', clusters: ['explorer', 'innovator', 'creator', 'communicator'] },
};

// =====================================================
// System 2: Western Astrology (12 Sun signs)
// Approximation using Sun sign only (date-based)
// =====================================================
export const WESTERN_SIGNS = [
  { key: 'aries', th: 'เมษ', en: 'Aries', icon: '♈', clusters: ['leader', 'innovator', 'protector', 'explorer'] },
  { key: 'taurus', th: 'พฤษภ', en: 'Taurus', icon: '♉', clusters: ['beauty', 'service', 'builder', 'finance'] },
  { key: 'gemini', th: 'เมถุน', en: 'Gemini', icon: '♊', clusters: ['communicator', 'teacher', 'creator', 'analyst'] },
  { key: 'cancer', th: 'กรกฎ', en: 'Cancer', icon: '♋', clusters: ['nurturer', 'healer', 'service', 'creator'] },
  { key: 'leo', th: 'สิงห์', en: 'Leo', icon: '♌', clusters: ['performer', 'leader', 'creator', 'communicator'] },
  { key: 'virgo', th: 'กันย์', en: 'Virgo', icon: '♍', clusters: ['analyst', 'healer', 'service', 'builder'] },
  { key: 'libra', th: 'ตุลย์', en: 'Libra', icon: '♎', clusters: ['justice', 'beauty', 'creator', 'communicator'] },
  { key: 'scorpio', th: 'พิจิก', en: 'Scorpio', icon: '♏', clusters: ['transformer', 'analyst', 'healer', 'strategist'] },
  { key: 'sagittarius', th: 'ธนู', en: 'Sagittarius', icon: '♐', clusters: ['teacher', 'explorer', 'communicator', 'spiritual'] },
  { key: 'capricorn', th: 'มังกร', en: 'Capricorn', icon: '♑', clusters: ['leader', 'strategist', 'builder', 'finance'] },
  { key: 'aquarius', th: 'กุมภ์', en: 'Aquarius', icon: '♒', clusters: ['innovator', 'tech', 'analyst', 'communicator'] },
  { key: 'pisces', th: 'มีน', en: 'Pisces', icon: '♓', clusters: ['creator', 'healer', 'spiritual', 'nurturer'] },
];

export function getWesternSign(month, day) {
  // Standard tropical ranges
  const ranges = [
    { sign: 'capricorn', from: [12, 22], to: [12, 31] },
    { sign: 'capricorn', from: [1, 1], to: [1, 19] },
    { sign: 'aquarius', from: [1, 20], to: [2, 18] },
    { sign: 'pisces', from: [2, 19], to: [3, 20] },
    { sign: 'aries', from: [3, 21], to: [4, 19] },
    { sign: 'taurus', from: [4, 20], to: [5, 20] },
    { sign: 'gemini', from: [5, 21], to: [6, 20] },
    { sign: 'cancer', from: [6, 21], to: [7, 22] },
    { sign: 'leo', from: [7, 23], to: [8, 22] },
    { sign: 'virgo', from: [8, 23], to: [9, 22] },
    { sign: 'libra', from: [9, 23], to: [10, 22] },
    { sign: 'scorpio', from: [10, 23], to: [11, 21] },
    { sign: 'sagittarius', from: [11, 22], to: [12, 21] },
  ];
  for (const r of ranges) {
    const [fm, fd] = r.from;
    const [tm, td] = r.to;
    if ((month === fm && day >= fd) || (month === tm && day <= td)) {
      return WESTERN_SIGNS.find(s => s.key === r.sign);
    }
  }
  return WESTERN_SIGNS[0];
}

// =====================================================
// System 3: Vedic Astrology (sidereal signs)
// Shifted ~24 days from tropical (Lahiri ayanamsa approximation)
// Signs = Rashi (12). Nakshatra skipped in MVP.
// =====================================================
export const VEDIC_SIGNS = [
  { key: 'mesh', th: 'เมษ (Mesh)', en: 'Aries', clusters: ['leader', 'protector', 'innovator', 'explorer'] },
  { key: 'vrishabh', th: 'พฤษภ (Vrishabh)', en: 'Taurus', clusters: ['builder', 'beauty', 'finance', 'service'] },
  { key: 'mithun', th: 'เมถุน (Mithun)', en: 'Gemini', clusters: ['communicator', 'teacher', 'analyst', 'creator'] },
  { key: 'kark', th: 'กรกฎ (Kark)', en: 'Cancer', clusters: ['nurturer', 'healer', 'spiritual', 'service'] },
  { key: 'simha', th: 'สิงห์ (Simha)', en: 'Leo', clusters: ['performer', 'leader', 'creator', 'teacher'] },
  { key: 'kanya', th: 'กันย์ (Kanya)', en: 'Virgo', clusters: ['analyst', 'healer', 'service', 'teacher'] },
  { key: 'tula', th: 'ตุลย์ (Tula)', en: 'Libra', clusters: ['justice', 'beauty', 'communicator', 'creator'] },
  { key: 'vrishchik', th: 'พิจิก (Vrishchik)', en: 'Scorpio', clusters: ['transformer', 'analyst', 'healer', 'spiritual'] },
  { key: 'dhanu', th: 'ธนู (Dhanu)', en: 'Sagittarius', clusters: ['teacher', 'spiritual', 'explorer', 'justice'] },
  { key: 'makar', th: 'มังกร (Makar)', en: 'Capricorn', clusters: ['leader', 'builder', 'strategist', 'finance'] },
  { key: 'kumbh', th: 'กุมภ์ (Kumbh)', en: 'Aquarius', clusters: ['innovator', 'spiritual', 'tech', 'communicator'] },
  { key: 'meen', th: 'มีน (Meen)', en: 'Pisces', clusters: ['creator', 'spiritual', 'healer', 'nurturer'] },
];

export function getVedicSign(month, day) {
  // Lahiri ayanamsa approximation: shift ~24 days back
  // Vedic ranges (sidereal 2026):
  const ranges = [
    { sign: 'mesh', from: [4, 14], to: [5, 14] },
    { sign: 'vrishabh', from: [5, 15], to: [6, 14] },
    { sign: 'mithun', from: [6, 15], to: [7, 15] },
    { sign: 'kark', from: [7, 16], to: [8, 16] },
    { sign: 'simha', from: [8, 17], to: [9, 16] },
    { sign: 'kanya', from: [9, 17], to: [10, 17] },
    { sign: 'tula', from: [10, 18], to: [11, 15] },
    { sign: 'vrishchik', from: [11, 16], to: [12, 15] },
    { sign: 'dhanu', from: [12, 16], to: [12, 31] },
    { sign: 'dhanu', from: [1, 1], to: [1, 14] },
    { sign: 'makar', from: [1, 15], to: [2, 12] },
    { sign: 'kumbh', from: [2, 13], to: [3, 14] },
    { sign: 'meen', from: [3, 15], to: [4, 13] },
  ];
  for (const r of ranges) {
    const [fm, fd] = r.from;
    const [tm, td] = r.to;
    if (fm === tm) {
      if (month === fm && day >= fd && day <= td) {
        return VEDIC_SIGNS.find(s => s.key === r.sign);
      }
    } else {
      if ((month === fm && day >= fd) || (month === tm && day <= td)) {
        return VEDIC_SIGNS.find(s => s.key === r.sign);
      }
    }
  }
  return VEDIC_SIGNS[0];
}

// =====================================================
// System 4: Chinese BaZi (10 Day Masters)
// Yang/Yin × 5 elements (Wood, Fire, Earth, Metal, Water)
// =====================================================
export const BAZI_DAY_MASTERS = [
  { key: 'jia', th: 'ไม้ใหญ่ (Yang Wood 甲)', en: 'Jia · Oak Tree', element: 'wood', polarity: 'yang', clusters: ['leader', 'teacher', 'builder', 'explorer'] },
  { key: 'yi', th: 'ไม้อ่อน (Yin Wood 乙)', en: 'Yi · Vine Flower', element: 'wood', polarity: 'yin', clusters: ['creator', 'nurturer', 'beauty', 'communicator'] },
  { key: 'bing', th: 'ไฟใหญ่ (Yang Fire 丙)', en: 'Bing · Sun', element: 'fire', polarity: 'yang', clusters: ['performer', 'communicator', 'leader', 'teacher'] },
  { key: 'ding', th: 'ไฟอ่อน (Yin Fire 丁)', en: 'Ding · Candle', element: 'fire', polarity: 'yin', clusters: ['creator', 'healer', 'spiritual', 'teacher'] },
  { key: 'wu', th: 'ดินใหญ่ (Yang Earth 戊)', en: 'Wu · Mountain', element: 'earth', polarity: 'yang', clusters: ['builder', 'protector', 'strategist', 'finance'] },
  { key: 'ji', th: 'ดินอ่อน (Yin Earth 己)', en: 'Ji · Fertile Soil', element: 'earth', polarity: 'yin', clusters: ['nurturer', 'service', 'healer', 'beauty'] },
  { key: 'geng', th: 'โลหะใหญ่ (Yang Metal 庚)', en: 'Geng · Sword', element: 'metal', polarity: 'yang', clusters: ['justice', 'protector', 'leader', 'strategist'] },
  { key: 'xin', th: 'โลหะอ่อน (Yin Metal 辛)', en: 'Xin · Jewel', element: 'metal', polarity: 'yin', clusters: ['beauty', 'creator', 'finance', 'communicator'] },
  { key: 'ren', th: 'น้ำใหญ่ (Yang Water 壬)', en: 'Ren · Ocean', element: 'water', polarity: 'yang', clusters: ['explorer', 'communicator', 'transformer', 'finance'] },
  { key: 'gui', th: 'น้ำอ่อน (Yin Water 癸)', en: 'Gui · Rain', element: 'water', polarity: 'yin', clusters: ['analyst', 'spiritual', 'healer', 'creator'] },
];

// Reference: 2000-01-01 was a Wu-Wu day (Day Master = Wu, index 4)
const BAZI_REF_DATE = new Date(Date.UTC(2000, 0, 1));
const BAZI_REF_INDEX = 4; // Wu (Yang Earth)

export function getBaZiDayMaster(year, month, day) {
  const target = new Date(Date.UTC(year, month - 1, day));
  const daysDiff = Math.round((target - BAZI_REF_DATE) / 86400000);
  const index = ((BAZI_REF_INDEX + daysDiff) % 10 + 10) % 10;
  return BAZI_DAY_MASTERS[index];
}

// =====================================================
// Destiny Matrix (Russian subtract-22 formula)
// Returns archetype D = A + B + C mod 22
// =====================================================
function reduceTo22(n) {
  while (n > 22) n -= 22;
  return n;
}

export function getDestinyArchetype(year, month, day) {
  const A = reduceTo22(day);
  const B = reduceTo22(month);
  let C = String(year).split('').reduce((s, c) => s + parseInt(c, 10), 0);
  C = reduceTo22(C);
  const D = reduceTo22(A + B + C);
  return { archNum: D, ...DESTINY_MAP[D] };
}

// =====================================================
// Convergence Engine
// Collects all cluster votes from 4 systems, tallies them.
// =====================================================
export function computeConvergence({ year, month, day }) {
  const destiny = getDestinyArchetype(year, month, day);
  const western = getWesternSign(month, day);
  const vedic = getVedicSign(month, day);
  const bazi = getBaZiDayMaster(year, month, day);

  const votesByCluster = {};
  const systemVotes = {
    destiny: destiny.clusters,
    western: western.clusters,
    vedic: vedic.clusters,
    bazi: bazi.clusters,
  };

  for (const [sys, clusters] of Object.entries(systemVotes)) {
    for (const c of clusters) {
      if (!votesByCluster[c]) {
        votesByCluster[c] = { count: 0, systems: [] };
      }
      votesByCluster[c].count += 1;
      votesByCluster[c].systems.push(sys);
    }
  }

  const ranked = Object.entries(votesByCluster)
    .map(([key, v]) => ({
      key,
      ...CLUSTERS[key],
      votes: v.count,
      systems: v.systems,
      level: v.count === 4 ? 'soul-calling' : v.count === 3 ? 'strong' : v.count === 2 ? 'supporting' : 'single',
    }))
    .sort((a, b) => b.votes - a.votes);

  return {
    destiny: {
      system: 'Destiny Matrix',
      systemTh: 'Destiny Matrix (ศาสตร์รัสเซีย)',
      icon: '🔮',
      archNum: destiny.archNum,
      label: `#${destiny.archNum} ${destiny.name}`,
      labelEn: destiny.en,
      clusters: destiny.clusters,
    },
    western: {
      system: 'Western Astrology',
      systemTh: 'Western Astrology (โหราศาสตร์ตะวันตก)',
      icon: '🏹',
      label: `ราศี${western.th} (${western.en})`,
      labelEn: western.en,
      clusters: western.clusters,
    },
    vedic: {
      system: 'Vedic Astrology',
      systemTh: 'Vedic Astrology (โหราศาสตร์อินเดีย)',
      icon: '🦂',
      label: western.en === vedic.en ? vedic.th : `${vedic.th} *`,
      labelEn: vedic.en,
      clusters: vedic.clusters,
    },
    bazi: {
      system: 'Chinese BaZi',
      systemTh: 'Chinese BaZi (โป๊ยยี่สี่เถียว)',
      icon: '🐉',
      label: bazi.th,
      labelEn: bazi.en,
      element: bazi.element,
      polarity: bazi.polarity,
      clusters: bazi.clusters,
    },
    ranked,
    soulCalling: ranked.filter(c => c.level === 'soul-calling'),
    strongMatches: ranked.filter(c => c.level === 'strong'),
    supporting: ranked.filter(c => c.level === 'supporting'),
  };
}
