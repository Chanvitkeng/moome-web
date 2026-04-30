# 🚀 DEPLOYMENT GUIDE — Moome SEO Landing

step-by-step วิธี deploy + setup SEO ทั้งหมด · ใช้เวลา ~2 ชั่วโมง

---

## 📦 Files ใน folder `seo/` นี้

```
seo/
├── index.html                    ← Landing page (root URL)
├── blog/
│   ├── index.html                ← Blog index
│   ├── destiny-matrix-คืออะไร.html
│   ├── ดวงคู่ราศี.html
│   └── ฤกษ์ลาออกงาน-2026.html
├── robots.txt                    ← Search bot config
├── sitemap.xml                   ← Sitemap for Google
├── SEO_STRATEGY.md               ← Strategy doc
└── DEPLOYMENT_GUIDE.md           ← (ไฟล์นี้)
```

---

## ⏱️ Step 1 — จดโดเมน (15 นาที, ฿350-500/ปี)

**แนะนำ:** Namecheap หรือ GoDaddy

1. เปิด [namecheap.com](https://namecheap.com) หรือ [godaddy.com](https://godaddy.com)
2. ค้นหาชื่อโดเมน (ลอง check ตามลำดับ):
   - ✅ `moome.app` (.app TLD ดีสำหรับแอป + auto HTTPS)
   - ✅ `moome.co` (สั้น · จำง่าย)
   - ✅ `moo.me` (creative TLD)
   - ✅ `moomeapp.com` (สำรอง)
3. ราคา .app ≈ ฿500/ปี · .com ≈ ฿350/ปี
4. ติ๊ก **WhoisGuard** (ปกปิดข้อมูลเจ้าของ — ฟรี)
5. ไม่ต้องซื้อ hosting · email · SSL — Vercel จะให้ฟรีหมด

---

## 🌐 Step 2 — Deploy บน Vercel (20 นาที, ฟรี)

### 2A. Sign up Vercel
1. ไป [vercel.com](https://vercel.com) · sign up ด้วย GitHub (ฟรี)
2. ถ้ายังไม่มี GitHub — สมัครก่อนที่ [github.com](https://github.com) (ฟรี)

### 2B. Upload files
มี 2 วิธี:

**วิธีง่ายสุด · Drag & Drop:**
1. ไป Vercel Dashboard → "Add New" → "Project"
2. ไม่ต้อง connect GitHub · เลือก "Browse for project"
3. ลาก folder `seo/` ทั้ง folder ลงไป
4. คลิก "Deploy"
5. รอ 30 วินาที — ได้ URL ชั่วคราว เช่น `moome-abc123.vercel.app`

**วิธี GitHub (แนะนำ · update ง่าย):**
1. สร้าง GitHub repo ใหม่ ชื่อ `moome-web`
2. Upload folder `seo/*` เข้า repo (drag drop ใน github.com)
3. Vercel → Add Project → import repo
4. Framework: "Other" (เพราะเป็น static HTML)
5. คลิก Deploy

### 2C. Connect domain
1. Vercel Project Settings → Domains
2. ใส่ `moome.app` (หรือ domain ที่จด)
3. Vercel จะให้ DNS records 2-3 รายการ
4. เปิด Namecheap dashboard → Domain → Advanced DNS
5. เพิ่ม records ตามที่ Vercel บอก:
   - Type: `A` Name: `@` Value: `76.76.21.21`
   - Type: `CNAME` Name: `www` Value: `cname.vercel-dns.com`
6. รอ 5-30 นาที — Vercel จะ verify + auto SSL
7. เสร็จ! เข้า `https://moome.app` ดูได้

---

## 🔍 Step 3 — Google Search Console (15 นาที)

นี่คือ tool ฟรีที่บอก Google ว่ามีเว็บใหม่ + ติดตามว่ามีคนค้นหาเว็บคุณยังไง

1. ไป [search.google.com/search-console](https://search.google.com/search-console)
2. เลือก "URL prefix" · ใส่ `https://moome.app`
3. Verify ownership — เลือก "HTML tag":
   - copy meta tag เช่น `<meta name="google-site-verification" content="...">`
   - paste ลงใน `<head>` ของ `index.html` (ก่อน `</head>`)
   - re-deploy Vercel
   - กด "Verify" ใน Search Console
4. **Submit Sitemap:**
   - Search Console → Sitemaps
   - ใส่ `sitemap.xml` → Submit
5. รอ 24-48 ชั่วโมง — Google เริ่ม crawl

---

## 📊 Step 4 — Google Analytics 4 (10 นาที)

1. ไป [analytics.google.com](https://analytics.google.com)
2. Admin → Create Property
3. Property name: "Moome"
4. Country: Thailand · Currency: THB
5. Industry: Internet & Software
6. ได้ Measurement ID: `G-XXXXXXXXXX`
7. Add tracking code ใน `<head>` ของทุก HTML:

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

8. Deploy ใหม่ — ตรวจสอบ Real-time → ต้องเห็นตัวเองเข้าเว็บ

---

## 🎯 Step 5 — Open Graph Image (30 นาที, สำคัญ!)

OG image คือรูปที่ขึ้นเวลาแชร์ลิงก์ใน Facebook/LINE/Twitter

1. ไป [Canva.com](https://canva.com) (ฟรี)
2. สร้างแบบใหม่ ขนาด 1200×630 px
3. ใช้ palette: cream + plum + gold
4. Layout:
   - "MOOME · มู-มี" (Italiana font ใหญ่)
   - "Self-Awareness Platform"
   - "ดูดวงด้วย 4 ศาสตร์ + Companion AI"
   - logo + URL "moome.app"
5. Export PNG · ตั้งชื่อ `og-image.jpg`
6. Upload เข้า folder `seo/` ที่ root
7. Deploy

ทดสอบ:
- [opengraph.xyz](https://www.opengraph.xyz) — paste URL ดู
- LINE: ส่งลิงก์ใน LINE chat ตัวเอง · ดูว่าขึ้น preview ถูกไหม
- Facebook: [developers.facebook.com/tools/debug/](https://developers.facebook.com/tools/debug/)

---

## 🎨 Step 6 — Logo + Favicon (1 ชม.)

### Logo
1. Canva หรือ Figma · สร้าง 512×512 PNG
2. ใส่ "MOOME" + ✦ ornament
3. Save เป็น `logo.png` · upload ลง root

### Favicon (icon ที่ขึ้นใน browser tab)
1. ไป [favicon.io](https://favicon.io)
2. Upload logo · download zip
3. Upload ทุกไฟล์ลง root:
   - `favicon.ico`
   - `apple-touch-icon.png`
   - `favicon-16x16.png`
   - `favicon-32x32.png`
4. Add ใน `<head>` ของทุก HTML:
   ```html
   <link rel="icon" type="image/x-icon" href="/favicon.ico">
   <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
   ```

---

## 📈 Step 7 — Initial SEO Tasks (1 อาทิตย์แรก)

### Day 1 (deploy เสร็จ)
- [ ] Submit sitemap ใน Search Console
- [ ] Verify GA4 ทำงาน
- [ ] Test mobile responsive (Chrome DevTools)
- [ ] Test page speed: [pagespeed.web.dev](https://pagespeed.web.dev) — ต้องเป็นสีเขียว (90+)

### Day 2-3
- [ ] Submit sitemap ใน Bing Webmaster Tools (เผื่อ Bing/DuckDuckGo)
- [ ] Test structured data: [search.google.com/test/rich-results](https://search.google.com/test/rich-results)
- [ ] Test FAQ schema: paste URL — ต้องเห็น FAQPage
- [ ] Add ทุกหน้าลงในบุ๊คมาร์ค Pantip / Reddit Thai

### Day 4-5
- [ ] โพสต์ใน Facebook กลุ่ม "สายมูยุคใหม่" / "Numerology Thailand" · share article (อย่าโพสต์โฆษณาตรง)
- [ ] โพสต์ Pantip ห้องดูดวง (โพสต์ที่ Pantip ดี SEO เพราะ DA สูง)
- [ ] ติดต่อ micro-influencer 5-10 คน ลองรีวิว

### Day 7
- [ ] เช็ค Search Console → Coverage — ต้องเห็น 5 pages indexed
- [ ] เช็ค GA4 → Acquisition — มีคนเข้าจาก Google ยัง?

---

## ✅ Step 8 — Production Checklist

ก่อน announce ให้คนทั่วไป:

- [ ] **HTTPS** ทำงาน (Vercel auto)
- [ ] **Mobile responsive** ทุกหน้า · test ที่ขนาด 320px, 375px, 768px
- [ ] **Page speed** Lighthouse ≥ 90
- [ ] **Meta tags** ครบทุกหน้า: title, description, og:image
- [ ] **Structured data** verified (Article, FAQ, Organization)
- [ ] **Internal links** ทำงาน · ไม่มี broken link
- [ ] **External links** เปิด tab ใหม่ (rel="noopener")
- [ ] **LINE OA link** ทำงาน — ตอนนี้เป็น placeholder · ต้องสร้าง LINE OA จริง
- [ ] **Privacy Policy + Terms** เพิ่มหน้าก่อนเก็บ user data
- [ ] **Cookie consent** ถ้าใช้ GA (ดูตาม PDPA)

---

## 🔄 Step 9 — Update Workflow (ตลอดอายุ)

### เพิ่มบทความใหม่
1. สร้างไฟล์ `seo/blog/[slug].html` (copy template จาก existing)
2. แก้ `<title>`, `<meta description>`, `<h1>`, content
3. update `sitemap.xml` เพิ่ม URL ใหม่
4. Push ไป GitHub · Vercel auto-redeploy
5. Submit URL ใหม่ใน Search Console → "Request Indexing"

### Update โพสต์เก่า
1. แก้ HTML
2. Update `<lastmod>` ใน sitemap.xml
3. Re-deploy
4. "Request Indexing" ใน Search Console

---

## 🎯 Goals 30 วันแรก

| Metric | Target |
|--------|--------|
| Pages indexed | 5+ |
| Impressions/วัน | 50+ |
| Clicks/วัน | 5+ |
| LINE OA followers | 100+ |
| Bounce rate | < 70% |
| Avg session | > 1:30 min |

---

## 🆘 Troubleshooting

### Vercel deploy fail
- เช็คว่า `index.html` อยู่ที่ root ของ folder
- เช็คขนาดไฟล์รวม < 100MB

### Domain ไม่ขึ้นเว็บ
- รอ 30 นาที (DNS propagation)
- ตรวจ DNS ที่ [dnschecker.org](https://dnschecker.org)

### Search Console ไม่ verify
- ตรวจว่า meta tag อยู่ใน `<head>` (ไม่ใช่ `<body>`)
- Re-deploy แล้ว clear browser cache (Cmd+Shift+R)

### GA4 ไม่เห็นข้อมูล
- รอ 5-15 นาที
- เช็คว่า `G-XXXXXXXXXX` ถูก
- Disable adblocker ตอน test

---

## 📞 ขั้นต่อไป

หลัง deploy ครบ + เห็น traffic เริ่มมา:

1. **Phase 2 (เดือน 2)** — เขียนเพิ่ม 10 บทความ:
   - 22 archetypes (1 ต่อ archetype)
   - สีมงคล 7 วัน
   - ดวงรายวัน 12 ราศี
2. **Phase 3 (เดือน 3-4)** — backlinks + influencer
3. **Phase 4 (เดือน 5+)** — ย้าย static → Next.js + LINE Mini App

ดู roadmap เต็มที่ `docs/ROADMAP.md` และ strategy ที่ `seo/SEO_STRATEGY.md`

---

✦ Deployment Guide v1.0 — เม.ย. 2026
