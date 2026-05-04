// Flex Message builders for Moome bot
// Triple Voice Output · Brand-styled cards · Quick Reply

const COLORS = {
  cream: '#F5EFE6',
  plum: '#3D2C4E',
  midnight: '#0F0A1E',
  gold: '#C9A961',
  goldSoft: '#EAD8B8',
  rose: '#B97A8B',
  sage: '#8AA888',
  lavender: '#B8A5C9',
  white: '#FFFFFF',
};

// Hero card with archetype + main answer
export function heroCardWithAnswer({ archetype, archName, age, mainAnswer }) {
  const archStr = archetype ? `#${archetype}` : '';
  const ageStr = age ? `${age} ปี` : '';

  return {
    type: 'flex',
    altText: `Moome AI · ${archName || 'คำตอบ'}`,
    contents: {
      type: 'bubble',
      size: 'kilo',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: COLORS.plum,
        paddingAll: '16px',
        contents: [
          {
            type: 'text',
            text: 'DESTINY MATRIX',
            color: COLORS.goldSoft,
            size: 'xxs',
            weight: 'bold',
            tracking: '0.2em',
          },
          {
            type: 'text',
            text: archStr,
            color: COLORS.gold,
            size: '4xl',
            weight: 'bold',
            margin: 'sm',
          },
          {
            type: 'text',
            text: archName || '—',
            color: COLORS.white,
            size: 'lg',
            weight: 'bold',
          },
          {
            type: 'text',
            text: ageStr,
            color: COLORS.goldSoft,
            size: 'xs',
          },
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: '16px',
        contents: [
          {
            type: 'text',
            text: mainAnswer || '',
            wrap: true,
            color: COLORS.midnight,
            size: 'sm',
          },
        ],
      },
    },
  };
}

// Voice card (Mu / Psy / Companion)
export function voiceCard({ voice, label, text }) {
  const palette = {
    mu: { border: COLORS.gold, bg: '#FFFBF2', label: '#B8923A' },
    psy: { border: COLORS.lavender, bg: '#FAF6FD', label: '#8A72A8' },
    companion: { border: COLORS.sage, bg: '#F4FAF4', label: '#6B8D6B' },
  }[voice] || { border: COLORS.gold, bg: COLORS.cream, label: COLORS.plum };

  return {
    type: 'flex',
    altText: label,
    contents: {
      type: 'bubble',
      size: 'kilo',
      body: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: palette.bg,
        paddingAll: '14px',
        borderColor: palette.border,
        borderWidth: '4px',
        cornerRadius: '8px',
        contents: [
          {
            type: 'text',
            text: label.toUpperCase(),
            color: palette.label,
            size: 'xxs',
            weight: 'bold',
            tracking: '0.18em',
          },
          {
            type: 'text',
            text: text || '',
            wrap: true,
            color: COLORS.midnight,
            size: 'sm',
            margin: 'sm',
          },
        ],
      },
    },
  };
}

// Combine 3 voices into a carousel (1 message, 3 swipeable cards)
export function tripleVoiceCarousel({ mu, psy, companion }) {
  const cards = [];
  if (mu) cards.push(voiceCard({ voice: 'mu', label: '🌑 Mu Insight', text: mu }).contents);
  if (psy) cards.push(voiceCard({ voice: 'psy', label: '🧠 Psychology', text: psy }).contents);
  if (companion) cards.push(voiceCard({ voice: 'companion', label: '🌿 Companion', text: companion }).contents);
  if (cards.length === 0) return null;
  return {
    type: 'flex',
    altText: '3 มุมมองจาก Moome',
    contents: {
      type: 'carousel',
      contents: cards,
    },
  };
}

// Quick Reply chips (LINE native · max 13 items)
export function quickReplyFromSuggestions(suggestions) {
  if (!Array.isArray(suggestions) || suggestions.length === 0) return undefined;
  const items = suggestions.slice(0, 13).map(s => {
    const text = typeof s === 'string' ? s : (s.text || '');
    if (!text) return null;
    return {
      type: 'action',
      action: {
        type: 'message',
        label: text.length > 20 ? text.substring(0, 17) + '...' : text,
        text,
      },
    };
  }).filter(Boolean);
  if (items.length === 0) return undefined;
  return { items };
}

// Welcome message for new follower (or restart)
export function welcomeMessage() {
  return {
    type: 'flex',
    altText: 'ยินดีต้อนรับสู่ Moome',
    contents: {
      type: 'bubble',
      size: 'kilo',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: COLORS.plum,
        paddingAll: '20px',
        contents: [
          { type: 'text', text: '✦ MOOME', color: COLORS.gold, size: 'lg', weight: 'bold', tracking: '0.3em' },
          { type: 'text', text: 'มู-มี · ดวงที่ฟัง ก่อนพูด', color: COLORS.goldSoft, size: 'sm', margin: 'sm' },
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: '16px',
        contents: [
          { type: 'text', text: 'พิมพ์คำถามเรื่อง archetype ของคุณ ความสัมพันธ์ การงาน หรือจังหวะชีวิต — AI จะตอบเฉพาะตัวให้', wrap: true, size: 'sm', color: COLORS.midnight },
          { type: 'text', text: 'ก่อนเริ่ม ส่งวันเกิดมาให้รู้จักกันก่อน · พิมพ์ในรูป DD/MM/YYYY (เช่น 23/11/1984)', wrap: true, size: 'xs', color: COLORS.plum, margin: 'md' },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        paddingAll: '12px',
        contents: [
          {
            type: 'button',
            style: 'primary',
            color: COLORS.plum,
            action: {
              type: 'uri',
              label: '🌐 เปิดถามมูใน Moome เต็ม',
              uri: 'https://liff.line.me/2009970211-9UWwksI6',
            },
          },
        ],
      },
    },
  };
}

// Ask user for birth date (when not yet known)
export function askForBirthDate() {
  return {
    type: 'text',
    text: 'ก่อนเริ่ม ส่งวันเกิดของคุณมาก่อนนะครับ\n\nพิมพ์ในรูป DD/MM/YYYY\n(เช่น 23/11/1984)\n\nหรือเปิด Moome เต็มได้ที่ https://liff.line.me/2009970211-9UWwksI6',
  };
}

// Confirm birth date saved
export function birthSavedMessage(archetype, archName) {
  return {
    type: 'flex',
    altText: `บันทึกแล้ว · #${archetype} ${archName}`,
    contents: {
      type: 'bubble',
      size: 'kilo',
      body: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#FFFBF2',
        paddingAll: '16px',
        borderColor: COLORS.gold,
        borderWidth: '4px',
        cornerRadius: '12px',
        contents: [
          { type: 'text', text: '✦ YOUR ARCHETYPE', color: COLORS.gold, size: 'xxs', weight: 'bold', tracking: '0.2em' },
          { type: 'text', text: `#${archetype}`, color: COLORS.gold, size: '4xl', weight: 'bold', margin: 'sm' },
          { type: 'text', text: archName, color: COLORS.plum, size: 'lg', weight: 'bold' },
          { type: 'separator', margin: 'md', color: COLORS.goldSoft },
          { type: 'text', text: 'ตอนนี้คุณถามอะไรเกี่ยวกับ archetype ของคุณ ความรัก การงาน หรือชีวิตได้เลย', wrap: true, size: 'sm', color: COLORS.midnight, margin: 'md' },
        ],
      },
    },
  };
}
