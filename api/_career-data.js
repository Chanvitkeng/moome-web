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
  1:  { name: 'นักสร้างสรรค์', en: 'The Magician', desc: 'เปลี่ยนไอเดียให้เป็นจริง · เริ่มต้นเก่ง · ใช้ทักษะหลากหลาย', clusters: ['creator', 'innovator', 'leader', 'communicator'] },
  2:  { name: 'ผู้หยั่งรู้', en: 'The High Priestess', desc: 'อ่านความรู้สึกได้ลึก · เห็น pattern ที่ซ่อน · intuitive สูง', clusters: ['healer', 'spiritual', 'teacher', 'analyst'] },
  3:  { name: 'จักรพรรดินี', en: 'The Empress', desc: 'สร้างความอบอุ่น · ดูแลคนรอบตัว · abundance mindset', clusters: ['nurturer', 'creator', 'beauty', 'service'] },
  4:  { name: 'ผู้สร้างฐาน', en: 'The Emperor', desc: 'ผู้นำที่สร้างโครงสร้าง · เปลี่ยน chaos ให้เป็น order · มั่นคง', clusters: ['leader', 'builder', 'strategist', 'justice'] },
  5:  { name: 'ครูแห่งจิตวิญญาณ', en: 'The Hierophant', desc: 'นำทางด้วยปัญญา · ส่งต่อความรู้ · ที่ปรึกษาที่คนเชื่อใจ', clusters: ['teacher', 'spiritual', 'communicator', 'strategist'] },
  6:  { name: 'ผู้รักลึก', en: 'The Lovers', desc: 'ฟังหัวใจมากกว่าหัวคิด · ตัดสินจาก resonance · ลึกในสัมพันธ์', clusters: ['healer', 'beauty', 'creator', 'service'] },
  7:  { name: 'ผู้พิชิต', en: 'The Chariot', desc: 'มีแรงขับสูง · ชอบความท้าทาย · เอาชนะอุปสรรค', clusters: ['leader', 'explorer', 'protector', 'innovator'] },
  8:  { name: 'พลังภายใน', en: 'Strength', desc: 'ใจเย็นแต่ทรงพลัง · ไม่ยอมแพ้ · เปลี่ยนความกลัวเป็นความแข็งแกร่ง', clusters: ['protector', 'leader', 'transformer', 'healer'] },
  9:  { name: 'ผู้แสวงหา', en: 'The Hermit', desc: 'ชอบอยู่คนเดียวเพื่อคิด · ค้นหาความจริง · ลึกและเงียบ', clusters: ['analyst', 'spiritual', 'teacher', 'explorer'] },
  10: { name: 'วงล้อแห่งโชค', en: 'Wheel of Fortune', desc: 'รู้จังหวะชีวิต · วัฏจักร · ใช้โอกาสเก่ง', clusters: ['transformer', 'strategist', 'finance', 'innovator'] },
  11: { name: 'ผู้ตัดสินด้วยใจ', en: 'Justice', desc: 'เคารพกฎและสมดุล · ตัดสินใจเฉียบ · ยุติธรรม', clusters: ['justice', 'strategist', 'analyst', 'leader'] },
  12: { name: 'ผู้มองมุมต่าง', en: 'The Hanged', desc: 'มองโลกจากมุมที่คนอื่นไม่เห็น · สะท้อนลึก · เปลี่ยนมุมมอง', clusters: ['innovator', 'spiritual', 'analyst', 'transformer'] },
  13: { name: 'ผู้ผ่านการเปลี่ยน', en: 'Death', desc: 'เปลี่ยนแปลงเก่ง · ปล่อยสิ่งเก่าได้ · เกิดใหม่ซ้ำแล้วซ้ำเล่า', clusters: ['transformer', 'healer', 'teacher', 'innovator'] },
  14: { name: 'ผู้สมดุล', en: 'Temperance', desc: 'หาจุดสมดุลเก่ง · ผสมของต่างให้เข้ากัน · ผู้ไกล่เกลี่ย', clusters: ['healer', 'transformer', 'justice', 'teacher'] },
  15: { name: 'ผู้รู้แรงดึงดูด', en: 'The Devil', desc: 'เข้าใจแรงดึงดูด · magnetic · ขายและเจรจาเก่ง', clusters: ['innovator', 'strategist', 'communicator', 'finance'] },
  16: { name: 'ผู้สร้างใหม่', en: 'The Tower', desc: 'ทลายของเก่าเพื่อสร้างใหม่ · bold moves · ไม่กลัวการเปลี่ยน', clusters: ['innovator', 'transformer', 'leader', 'explorer'] },
  17: { name: 'ผู้ส่องแสง', en: 'The Star', desc: 'มีความหวัง · inspire คนอื่น · creative และ spiritual', clusters: ['creator', 'communicator', 'spiritual', 'healer'] },
  18: { name: 'ผู้ฝัน', en: 'The Moon', desc: 'intuitive สูง · เห็นสิ่งที่ซ่อน · creative + spiritual', clusters: ['creator', 'spiritual', 'healer', 'analyst'] },
  19: { name: 'ดวงอาทิตย์', en: 'The Sun', desc: 'พลังสว่าง · ดึงดูดคน · leader ธรรมชาติ', clusters: ['communicator', 'performer', 'leader', 'teacher'] },
  20: { name: 'ผู้ตื่นรู้', en: 'Judgement', desc: 'เรียกคนให้ตื่น · transformative communication · มี calling', clusters: ['transformer', 'communicator', 'spiritual', 'teacher'] },
  21: { name: 'ผู้บูรณาการ', en: 'The World', desc: 'มอง big picture · บูรณาการศาสตร์ · completion energy', clusters: ['strategist', 'leader', 'teacher', 'creator'] },
  22: { name: 'ผู้เริ่มใหม่', en: 'The Fool', desc: 'กล้าทดลอง · ไม่ติดกรอบ · beginner mind', clusters: ['explorer', 'innovator', 'creator', 'communicator'] },
};

// =====================================================
// System 2: Western Astrology (12 Sun signs)
// Approximation using Sun sign only (date-based)
// =====================================================
export const WESTERN_SIGNS = [
  { key: 'aries', th: 'เมษ', en: 'Aries', icon: '♈', desc: 'ไฟ · ผู้บุกเบิก · ตรงไปตรงมา', clusters: ['leader', 'innovator', 'protector', 'explorer'] },
  { key: 'taurus', th: 'พฤษภ', en: 'Taurus', icon: '♉', desc: 'ดิน · ชอบความมั่นคง · ของสวยงาม', clusters: ['beauty', 'service', 'builder', 'finance'] },
  { key: 'gemini', th: 'เมถุน', en: 'Gemini', icon: '♊', desc: 'ลม · สื่อสารเก่ง · ปรับตัวไว · ชอบเรียนรู้', clusters: ['communicator', 'teacher', 'creator', 'analyst'] },
  { key: 'cancer', th: 'กรกฎ', en: 'Cancer', icon: '♋', desc: 'น้ำ · ใจอ่อนโยน · ดูแลคนรอบตัว', clusters: ['nurturer', 'healer', 'service', 'creator'] },
  { key: 'leo', th: 'สิงห์', en: 'Leo', icon: '♌', desc: 'ไฟ · ชอบความสว่าง · drama · ดึงดูดคน', clusters: ['performer', 'leader', 'creator', 'communicator'] },
  { key: 'virgo', th: 'กันย์', en: 'Virgo', icon: '♍', desc: 'ดิน · ละเอียดรอบคอบ · ช่วยคน · perfection', clusters: ['analyst', 'healer', 'service', 'builder'] },
  { key: 'libra', th: 'ตุลย์', en: 'Libra', icon: '♎', desc: 'ลม · ชอบความสมดุล · สวยงาม · ไกล่เกลี่ย', clusters: ['justice', 'beauty', 'creator', 'communicator'] },
  { key: 'scorpio', th: 'พิจิก', en: 'Scorpio', icon: '♏', desc: 'น้ำ · ลึกและเข้ม · เห็นความจริงที่คนไม่เห็น', clusters: ['transformer', 'analyst', 'healer', 'strategist'] },
  { key: 'sagittarius', th: 'ธนู', en: 'Sagittarius', icon: '♐', desc: 'ไฟ · ชอบสำรวจ · ปรัชญา · แบ่งปันความรู้', clusters: ['teacher', 'explorer', 'communicator', 'spiritual'] },
  { key: 'capricorn', th: 'มังกร', en: 'Capricorn', icon: '♑', desc: 'ดิน · มุ่งเป้า · วินัยสูง · ไต่สู่จุดสูงสุด', clusters: ['leader', 'strategist', 'builder', 'finance'] },
  { key: 'aquarius', th: 'กุมภ์', en: 'Aquarius', icon: '♒', desc: 'ลม · ไอเดียล้ำ · มนุษยชาติ · เทคโนโลยี', clusters: ['innovator', 'tech', 'analyst', 'communicator'] },
  { key: 'pisces', th: 'มีน', en: 'Pisces', icon: '♓', desc: 'น้ำ · ฝัน · ศิลปะ · spiritual · empathy สูง', clusters: ['creator', 'healer', 'spiritual', 'nurturer'] },
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
  { key: 'mesh', th: 'เมษ (Mesh)', en: 'Aries', desc: 'ปกครองโดยอังคาร · กรรมแห่งการบุกเบิก · กล้าตัดสินใจ', clusters: ['leader', 'protector', 'innovator', 'explorer'] },
  { key: 'vrishabh', th: 'พฤษภ (Vrishabh)', en: 'Taurus', desc: 'ปกครองโดยศุกร์ · อดทน · สะสมความมั่งคั่งและความงาม', clusters: ['builder', 'beauty', 'finance', 'service'] },
  { key: 'mithun', th: 'เมถุน (Mithun)', en: 'Gemini', desc: 'ปกครองโดยพุธ · ปัญญาคล่องแคล่ว · สื่อสารและเรียนรู้', clusters: ['communicator', 'teacher', 'analyst', 'creator'] },
  { key: 'kark', th: 'กรกฎ (Kark)', en: 'Cancer', desc: 'ปกครองโดยจันทร์ · emotional depth · ครอบครัวและความทรงจำ', clusters: ['nurturer', 'healer', 'spiritual', 'service'] },
  { key: 'simha', th: 'สิงห์ (Simha)', en: 'Leo', desc: 'ปกครองโดยอาทิตย์ · leadership โดยธรรมชาติ · dharma ของผู้นำ', clusters: ['performer', 'leader', 'creator', 'teacher'] },
  { key: 'kanya', th: 'กันย์ (Kanya)', en: 'Virgo', desc: 'ปกครองโดยพุธ · service · การเยียวยาและปรับปรุง', clusters: ['analyst', 'healer', 'service', 'teacher'] },
  { key: 'tula', th: 'ตุลย์ (Tula)', en: 'Libra', desc: 'ปกครองโดยศุกร์ · dharma แห่งความสมดุล · ความสัมพันธ์', clusters: ['justice', 'beauty', 'communicator', 'creator'] },
  { key: 'vrishchik', th: 'พิจิก (Vrishchik)', en: 'Scorpio', desc: 'ปกครองโดยอังคาร+มงคล · การเปลี่ยนแปลงลึก · occult', clusters: ['transformer', 'analyst', 'healer', 'spiritual'] },
  { key: 'dhanu', th: 'ธนู (Dhanu)', en: 'Sagittarius', desc: 'ปกครองโดยพฤหัส · guru · ปรัชญา · dharma แห่งปัญญา', clusters: ['teacher', 'spiritual', 'explorer', 'justice'] },
  { key: 'makar', th: 'มังกร (Makar)', en: 'Capricorn', desc: 'ปกครองโดยศนิ · กรรมหนัก · เป้าหมายระยะยาว · มั่นคง', clusters: ['leader', 'builder', 'strategist', 'finance'] },
  { key: 'kumbh', th: 'กุมภ์ (Kumbh)', en: 'Aquarius', desc: 'ปกครองโดยศนิ · นวัตกรรมเพื่อมนุษยชาติ · spiritual seeker', clusters: ['innovator', 'spiritual', 'tech', 'communicator'] },
  { key: 'meen', th: 'มีน (Meen)', en: 'Pisces', desc: 'ปกครองโดยพฤหัส · moksha energy · ปล่อยวาง · ศิลปะและศรัทธา', clusters: ['creator', 'spiritual', 'healer', 'nurturer'] },
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
  { key: 'jia', th: 'ไม้ใหญ่ (Yang Wood 甲)', en: 'Jia · Oak Tree', element: 'wood', polarity: 'yang', desc: 'ต้นไม้ใหญ่ · โตขึ้นเรื่อยๆ · ให้ร่มเงาคนอื่น', clusters: ['leader', 'teacher', 'builder', 'explorer'] },
  { key: 'yi', th: 'ไม้อ่อน (Yin Wood 乙)', en: 'Yi · Vine Flower', element: 'wood', polarity: 'yin', desc: 'เถาวัลย์ · ดอกไม้ · ยืดหยุ่น · ปรับเข้าทุกสถานการณ์', clusters: ['creator', 'nurturer', 'beauty', 'communicator'] },
  { key: 'bing', th: 'ไฟใหญ่ (Yang Fire 丙)', en: 'Bing · Sun', element: 'fire', polarity: 'yang', desc: 'ดวงอาทิตย์ · ให้แสงสว่างแก่คนรอบตัว · passionate', clusters: ['performer', 'communicator', 'leader', 'teacher'] },
  { key: 'ding', th: 'ไฟอ่อน (Yin Fire 丁)', en: 'Ding · Candle', element: 'fire', polarity: 'yin', desc: 'เทียน · ไฟในใจ · ปัญญาและศิลปะ · intimate warmth', clusters: ['creator', 'healer', 'spiritual', 'teacher'] },
  { key: 'wu', th: 'ดินใหญ่ (Yang Earth 戊)', en: 'Wu · Mountain', element: 'earth', polarity: 'yang', desc: 'ภูเขา · มั่นคงไม่หวั่นไหว · คนพึ่งพาได้', clusters: ['builder', 'protector', 'strategist', 'finance'] },
  { key: 'ji', th: 'ดินอ่อน (Yin Earth 己)', en: 'Ji · Fertile Soil', element: 'earth', polarity: 'yin', desc: 'ดินสวน · nurture ให้ของอื่นเติบโต · อ่อนโยนเอื้ออาทร', clusters: ['nurturer', 'service', 'healer', 'beauty'] },
  { key: 'geng', th: 'โลหะใหญ่ (Yang Metal 庚)', en: 'Geng · Sword', element: 'metal', polarity: 'yang', desc: 'ดาบ · เด็ดขาด · ตรงไปตรงมา · justice', clusters: ['justice', 'protector', 'leader', 'strategist'] },
  { key: 'xin', th: 'โลหะอ่อน (Yin Metal 辛)', en: 'Xin · Jewel', element: 'metal', polarity: 'yin', desc: 'อัญมณี · refined · คุณค่าสูง · ความงามที่คงทน', clusters: ['beauty', 'creator', 'finance', 'communicator'] },
  { key: 'ren', th: 'น้ำใหญ่ (Yang Water 壬)', en: 'Ren · Ocean', element: 'water', polarity: 'yang', desc: 'มหาสมุทร · กว้างใหญ่ · ไหลไป flexibility', clusters: ['explorer', 'communicator', 'transformer', 'finance'] },
  { key: 'gui', th: 'น้ำอ่อน (Yin Water 癸)', en: 'Gui · Rain', element: 'water', polarity: 'yin', desc: 'ฝน · น้ำค้าง · softly nurture · intuition ลึก', clusters: ['analyst', 'spiritual', 'healer', 'creator'] },
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
// Age Group Logic
// =====================================================
export function getAgeGroup(year, month, day) {
  const today = new Date();
  let age = today.getFullYear() - year;
  if (today.getMonth() + 1 < month || (today.getMonth() + 1 === month && today.getDate() < day)) age--;
  if (age <= 18) return 'teen';
  if (age <= 28) return 'young_adult';
  if (age <= 45) return 'mid_career';
  return 'senior';
}

// Age-aware job suggestions per cluster
// teen = คณะ/สาขา · young = อาชีพเริ่มต้น · mid = pivot/เติบโต · senior = leverage
const AGE_JOBS = {
  teacher: {
    teen:        ['ครุศาสตร์ · ศึกษาศาสตร์', 'จิตวิทยา', 'ภาษาศาสตร์', 'นิเทศศาสตร์', 'วิทยาศาสตร์การกีฬา'],
    young_adult: ['ครู · อาจารย์มหาวิทยาลัย', 'Corporate Trainer', 'Content Creator ที่สอน', 'Instructional Designer'],
    mid_career:  ['L&D Manager', 'Head of Training', 'Executive Coach', 'อาจารย์พิเศษ · วิทยากร'],
    senior:      ['Mentor องค์กร', 'Professor', 'วิทยากรอิสระ', 'Thought Leader ในสาย'],
  },
  healer: {
    teen:        ['แพทยศาสตร์', 'พยาบาลศาสตร์', 'จิตวิทยา', 'กายภาพบำบัด', 'สาธารณสุข'],
    young_adult: ['พยาบาล · นักจิตวิทยา', 'Wellness Coach', 'นักสังคมสงเคราะห์', 'Physical Therapist'],
    mid_career:  ['Clinical Director', 'Therapist อิสระ', 'Mental Health Consultant', 'หัวหน้าทีมสุขภาพ'],
    senior:      ['ที่ปรึกษาสุขภาพองค์กร', 'Holistic Health Expert', 'เจ้าของคลินิก/ศูนย์สุขภาพ'],
  },
  creator: {
    teen:        ['นิเทศศาสตร์ · Fine Arts', 'ออกแบบนิเทศศิลป์', 'สถาปัตยกรรม', 'ดนตรี · ศิลปะการแสดง'],
    young_adult: ['Graphic Designer', 'Content Creator', 'Copywriter', 'UX/UI Designer', 'Filmmaker'],
    mid_career:  ['Creative Director', 'Art Director', 'Brand Strategist', 'เจ้าของ Studio'],
    senior:      ['Creative Consultant', 'ศิลปินอิสระ', 'Creative Mentor', 'Founder สตูดิโอ'],
  },
  leader: {
    teen:        ['บริหารธุรกิจ', 'รัฐศาสตร์', 'เศรษฐศาสตร์', 'วิศวกรรมอุตสาหการ'],
    young_adult: ['Management Trainee', 'Startup Founder', 'Project Manager', 'Business Development'],
    mid_career:  ['Director · VP', 'Founder · CEO', 'General Manager', 'Country Manager'],
    senior:      ['Board Member', 'Executive Chairman', 'Angel Investor', 'ที่ปรึกษาองค์กร'],
  },
  builder: {
    teen:        ['วิศวกรรมศาสตร์', 'สถาปัตยกรรม', 'เทคโนโลยีสารสนเทศ', 'อุตสาหกรรม'],
    young_adult: ['Software Engineer', 'Civil Engineer', 'Product Manager', 'Operations'],
    mid_career:  ['Engineering Manager', 'CTO · COO', 'Infrastructure Lead', 'Head of Product'],
    senior:      ['Technical Advisor', 'เจ้าของบริษัทก่อสร้าง/เทค', 'Fractional CTO', 'Systems Architect'],
  },
  analyst: {
    teen:        ['วิทยาศาสตร์', 'เศรษฐศาสตร์', 'คณิตศาสตร์ · สถิติ', 'วิศวกรรมคอมพิวเตอร์'],
    young_adult: ['Data Analyst', 'Research Analyst', 'Business Analyst', 'Consultant จูเนียร์'],
    mid_career:  ['Senior Analyst', 'Research Manager', 'Strategy Consultant', 'Head of Analytics'],
    senior:      ['Chief Data Officer', 'Independent Researcher', 'ที่ปรึกษาวิจัย', 'Academic Expert'],
  },
  communicator: {
    teen:        ['นิเทศศาสตร์', 'อักษรศาสตร์', 'ภาษาอังกฤษ', 'วารสารศาสตร์'],
    young_adult: ['PR · Copywriter', 'Journalist', 'Social Media Manager', 'Podcaster'],
    mid_career:  ['Communications Director', 'Brand Manager', 'Chief Marketing Officer', 'Public Speaker'],
    senior:      ['Keynote Speaker', 'Author', 'Media Consultant', 'Brand Ambassador'],
  },
  strategist: {
    teen:        ['เศรษฐศาสตร์', 'บริหารธุรกิจ', 'รัฐศาสตร์', 'คณิตศาสตร์'],
    young_adult: ['Management Consultant', 'Business Analyst', 'Strategy Associate', 'Investment Analyst'],
    mid_career:  ['Chief Strategy Officer', 'Head of Growth', 'Investment Director', 'Management Consultant อาวุโส'],
    senior:      ['Board Advisor', 'VC Partner', 'Independent Strategy Consultant', 'Executive Mentor'],
  },
  service: {
    teen:        ['การโรงแรม · Tourism', 'บริหารธุรกิจ', 'อาหารและโภชนาการ', 'การท่องเที่ยว'],
    young_adult: ['Hotel Manager', 'Event Planner', 'Customer Success', 'Chef · F&B Manager'],
    mid_career:  ['General Manager โรงแรม', 'F&B Director', 'Service Design Lead', 'ผู้จัดการสาขา/แฟรนไชส์'],
    senior:      ['เจ้าของธุรกิจบริการ', 'Hospitality Consultant', 'F&B Investor', 'เจ้าของแฟรนไชส์'],
  },
  justice: {
    teen:        ['นิติศาสตร์', 'รัฐศาสตร์', 'บริหารรัฐกิจ', 'จิตวิทยา'],
    young_adult: ['ทนายความ', 'HR Generalist', 'Compliance Analyst', 'Diplomat จูเนียร์'],
    mid_career:  ['Senior Lawyer · Partner', 'HR Director', 'Chief Compliance Officer', 'Mediator อิสระ'],
    senior:      ['ผู้พิพากษา · อัยการ', 'Legal Advisor', 'Ethics Consultant', 'กรรมการอิสระ'],
  },
  innovator: {
    teen:        ['วิศวกรรมศาสตร์', 'คอมพิวเตอร์', 'วิทยาศาสตร์ประยุกต์', 'ออกแบบอุตสาหกรรม'],
    young_adult: ['Startup Founder', 'Product Manager', 'R&D Engineer', 'Venture Builder'],
    mid_career:  ['Chief Innovation Officer', 'Head of R&D', 'Startup Investor', 'Corporate Innovator'],
    senior:      ['Serial Entrepreneur', 'Angel Investor', 'Innovation Advisor', 'Inventor · Patent Holder'],
  },
  nurturer: {
    teen:        ['จิตวิทยา', 'พยาบาล', 'ครุศาสตร์ปฐมวัย', 'สังคมสงเคราะห์'],
    young_adult: ['HR People Ops', 'ครูอนุบาล', 'Social Worker', 'Caregiver Coordinator'],
    mid_career:  ['CHRO · People Director', 'Family Therapist', 'Community Manager', 'Head of Welfare'],
    senior:      ['Organizational Psychologist', 'Community Leader', 'เจ้าของสถานดูแลผู้สูงอายุ'],
  },
  explorer: {
    teen:        ['ภูมิศาสตร์', 'มานุษยวิทยา', 'ภาษาต่างประเทศ', 'วารสารศาสตร์'],
    young_adult: ['Travel Writer', 'Field Journalist', 'Tour Guide', 'Research Assistant'],
    mid_career:  ['Regional Director', 'Country Manager', 'Documentary Filmmaker', 'International Consultant'],
    senior:      ['Expedition Leader', 'Anthropologist อิสระ', 'Travel Consultant', 'Author · Speaker'],
  },
  transformer: {
    teen:        ['จิตวิทยา', 'สังคมวิทยา', 'การแนะแนว', 'ปรัชญา'],
    young_adult: ['Life Coach', 'Change Management Analyst', 'Organizational Development', 'Counselor'],
    mid_career:  ['Executive Coach', 'Change Management Director', 'Reinvention Strategist', 'Therapist อาวุโส'],
    senior:      ['Leadership Coach', 'Legacy Advisor', 'ที่ปรึกษาวางแผนชีวิต', 'Author · Speaker'],
  },
  beauty: {
    teen:        ['ออกแบบแฟชั่น', 'ออกแบบตกแต่งภายใน', 'Fine Arts', 'Beauty & Cosmetology'],
    young_adult: ['Fashion Designer', 'Interior Designer', 'Makeup Artist', 'Brand Designer'],
    mid_career:  ['Creative Director ฝ่าย Lifestyle', 'Head of Design', 'เจ้าของ Studio', 'Brand Consultant'],
    senior:      ['Design Consultant', 'Fashion Editor', 'เจ้าของแบรนด์', 'Aesthetic Advisor'],
  },
  performer: {
    teen:        ['ศิลปะการแสดง', 'ดนตรี', 'นิเทศศาสตร์', 'ภาษาและวรรณคดี'],
    young_adult: ['นักแสดง', 'MC · Host', 'YouTuber · Podcaster', 'Public Speaker'],
    mid_career:  ['ผู้กำกับ', 'Executive Producer', 'Head of Entertainment', 'Keynote Speaker'],
    senior:      ['Veteran Actor', 'Entertainment Consultant', 'อาจารย์ศิลปะการแสดง', 'Producer อิสระ'],
  },
  spiritual: {
    teen:        ['ปรัชญา', 'ศาสนา', 'จิตวิทยา', 'มานุษยวิทยา'],
    young_adult: ['Meditation Teacher', 'Yoga Instructor', 'Astrologer', 'Wellness Practitioner'],
    mid_career:  ['Spiritual Director', 'Retreat Facilitator', 'Holistic Therapist', 'Energy Healer'],
    senior:      ['Spiritual Elder', 'Author · Speaker', 'เจ้าของ Retreat Center', 'Dharma Teacher'],
  },
  finance: {
    teen:        ['การเงินและการบัญชี', 'เศรษฐศาสตร์', 'คณิตศาสตร์การเงิน', 'บริหารธุรกิจ'],
    young_adult: ['Financial Analyst', 'Trader', 'Accountant', 'Financial Planner จูเนียร์'],
    mid_career:  ['CFO · Head of Finance', 'Investment Manager', 'Wealth Manager', 'Fund Manager'],
    senior:      ['Chief Investment Officer', 'Family Office Manager', 'ที่ปรึกษาการเงิน', 'เจ้าของกองทุน'],
  },
  tech: {
    teen:        ['วิทยาการคอมพิวเตอร์', 'วิศวกรรมซอฟต์แวร์', 'AI · Data Science', 'Cybersecurity'],
    young_adult: ['Software Developer', 'Data Scientist', 'DevOps Engineer', 'AI/ML Engineer'],
    mid_career:  ['Engineering Manager', 'CTO', 'Head of AI', 'Tech Lead · Principal Engineer'],
    senior:      ['Chief AI Officer', 'Tech Investor', 'Technology Advisor', 'Fractional CTO'],
  },
  protector: {
    teen:        ['นิติศาสตร์', 'รัฐประศาสนศาสตร์', 'วิทยาศาสตร์การกีฬา · ทหาร', 'ความมั่นคง'],
    young_adult: ['ตำรวจ · ทหาร', 'Security Analyst', 'Risk Manager', 'Compliance Officer'],
    mid_career:  ['Head of Security', 'Risk Director', 'CISO', 'Crisis Management Consultant'],
    senior:      ['Security Advisor', 'Risk Consultant', 'ที่ปรึกษาความมั่นคง', 'Governance Expert'],
  },
};

const AGE_GROUP_LABEL = {
  teen:        '🎓 แนะนำคณะ/สาขา (อายุ ≤ 18)',
  young_adult: '🚀 อาชีพเริ่มต้น (อายุ 19–28)',
  mid_career:  '📈 เส้นทาง pivot/เติบโต (อายุ 29–45)',
  senior:      '🏆 Leverage ประสบการณ์ (อายุ 46+)',
};

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

  const ageGroup = getAgeGroup(year, month, day);

  const ranked = Object.entries(votesByCluster)
    .map(([key, v]) => ({
      key,
      ...CLUSTERS[key],
      jobs: (AGE_JOBS[key] && AGE_JOBS[key][ageGroup]) || CLUSTERS[key].jobs,
      votes: v.count,
      systems: v.systems,
      level: v.count === 4 ? 'soul-calling' : v.count === 3 ? 'strong' : v.count === 2 ? 'supporting' : 'single',
    }))
    .sort((a, b) => b.votes - a.votes);

  return {
    ageGroup,
    ageGroupLabel: AGE_GROUP_LABEL[ageGroup],
    destiny: {
      system: 'Destiny Matrix',
      systemTh: 'Destiny Matrix (ศาสตร์รัสเซีย)',
      icon: '🔮',
      archNum: destiny.archNum,
      label: `#${destiny.archNum} ${destiny.name}`,
      labelEn: destiny.en,
      desc: destiny.desc || '',
      clusters: destiny.clusters,
    },
    western: {
      system: 'Western Astrology',
      systemTh: 'Western Astrology (โหราศาสตร์ตะวันตก)',
      icon: '🏹',
      label: `ราศี${western.th} (${western.en})`,
      labelEn: western.en,
      desc: western.desc || '',
      clusters: western.clusters,
    },
    vedic: {
      system: 'Vedic Astrology',
      systemTh: 'Vedic Astrology (โหราศาสตร์อินเดีย)',
      icon: '🦂',
      label: western.en === vedic.en ? vedic.th : `${vedic.th} *`,
      labelEn: vedic.en,
      desc: vedic.desc || '',
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
      desc: bazi.desc || '',
      clusters: bazi.clusters,
    },
    ranked,
    soulCalling: ranked.filter(c => c.level === 'soul-calling'),
    strongMatches: ranked.filter(c => c.level === 'strong'),
    supporting: ranked.filter(c => c.level === 'supporting'),
  };
}
