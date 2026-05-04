// Moome Feedback Widget v1.0
// Floating button + modal · ส่งความคิดเห็นจาก user → admin email
// Include via: <script src="/feedback-widget.js" defer></script>

(function() {
  if (window.__moomeFeedbackInit) return;
  window.__moomeFeedbackInit = true;

  const STYLE = `
    .mfb-btn {
      position: fixed; bottom: 24px; right: 24px; z-index: 9998;
      background: linear-gradient(135deg, #3d2c4e, #0f0a1e);
      color: #ead8b8; border: none; cursor: pointer;
      width: 56px; height: 56px; border-radius: 50%;
      box-shadow: 0 8px 24px rgba(15,10,30,0.35);
      font-size: 22px; transition: transform .2s, box-shadow .2s;
      display: flex; align-items: center; justify-content: center;
      font-family: 'IBM Plex Sans Thai', sans-serif;
    }
    .mfb-btn:hover { transform: scale(1.08); box-shadow: 0 12px 32px rgba(15,10,30,0.45); }
    .mfb-btn:focus { outline: 2px solid #c9a961; outline-offset: 4px; }

    .mfb-overlay {
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(15,10,30,0.6); backdrop-filter: blur(4px);
      display: none; align-items: center; justify-content: center;
      padding: 20px; animation: mfbFade .2s ease-out;
    }
    .mfb-overlay.open { display: flex; }
    @keyframes mfbFade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes mfbSlide { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

    .mfb-modal {
      background: #F5EFE6; border-radius: 20px;
      padding: 28px 24px; max-width: 460px; width: 100%;
      max-height: 90vh; overflow-y: auto;
      font-family: 'IBM Plex Sans Thai', sans-serif;
      color: #0f0a1e; animation: mfbSlide .25s ease-out;
      box-shadow: 0 20px 60px rgba(0,0,0,0.4);
    }
    .mfb-modal h3 {
      font-size: 20px; margin: 0 0 6px; font-weight: 700; color: #3d2c4e;
    }
    .mfb-modal .mfb-sub {
      font-size: 13px; color: #6b5b7a; margin-bottom: 20px;
    }
    .mfb-modal label {
      display: block; font-size: 12px; letter-spacing: .12em;
      color: #b97a8b; text-transform: uppercase; font-weight: 700;
      margin: 16px 0 8px;
    }
    .mfb-moods { display: flex; gap: 10px; margin-bottom: 4px; }
    .mfb-mood {
      flex: 1; background: white; border: 2px solid transparent;
      padding: 14px 8px; border-radius: 12px; cursor: pointer;
      font-size: 28px; transition: all .15s; font-family: inherit;
    }
    .mfb-mood:hover { border-color: #ead8b8; }
    .mfb-mood.active { border-color: #c9a961; background: #fffbf2; transform: translateY(-2px); }
    .mfb-mood-label { display: block; font-size: 11px; color: #6b5b7a; margin-top: 4px; }

    .mfb-modal textarea, .mfb-modal input[type=email] {
      width: 100%; box-sizing: border-box;
      background: white; border: 1px solid #e0d4c0;
      border-radius: 10px; padding: 12px 14px;
      font-family: inherit; font-size: 14.5px; color: #0f0a1e;
      resize: vertical;
    }
    .mfb-modal textarea { min-height: 96px; }
    .mfb-modal textarea:focus, .mfb-modal input[type=email]:focus {
      outline: none; border-color: #c9a961;
    }

    .mfb-honey {
      position: absolute; left: -9999px;
      width: 1px; height: 1px; opacity: 0;
    }

    .mfb-actions {
      display: flex; gap: 10px; margin-top: 20px;
    }
    .mfb-cancel, .mfb-submit {
      flex: 1; padding: 13px 16px; border-radius: 999px;
      cursor: pointer; font-family: inherit; font-weight: 600;
      font-size: 14px; transition: all .15s;
    }
    .mfb-cancel {
      background: transparent; border: 1px solid #d4c5b3; color: #6b5b7a;
    }
    .mfb-cancel:hover { background: rgba(0,0,0,0.04); }
    .mfb-submit {
      background: #3d2c4e; border: none; color: #ead8b8;
    }
    .mfb-submit:hover { background: #0f0a1e; }
    .mfb-submit:disabled { opacity: 0.6; cursor: wait; }

    .mfb-status {
      margin-top: 14px; padding: 12px; border-radius: 10px;
      font-size: 13.5px; line-height: 1.6; display: none;
    }
    .mfb-status.ok { background: #f0fbf3; color: #2d5e3a; display: block; }
    .mfb-status.err { background: #fdf0f3; color: #8a3a4a; display: block; }

    @media (max-width: 480px) {
      .mfb-btn { bottom: 16px; right: 16px; width: 52px; height: 52px; font-size: 20px; }
      .mfb-modal { padding: 22px 18px; border-radius: 16px; }
    }
  `;

  function inject() {
    // Style
    const s = document.createElement('style');
    s.textContent = STYLE;
    document.head.appendChild(s);

    // Button
    const btn = document.createElement('button');
    btn.className = 'mfb-btn';
    btn.setAttribute('aria-label', 'ส่งความคิดเห็น');
    btn.title = 'ส่งความคิดเห็น';
    btn.innerHTML = '💬';
    document.body.appendChild(btn);

    // Modal
    const overlay = document.createElement('div');
    overlay.className = 'mfb-overlay';
    overlay.innerHTML = `
      <div class="mfb-modal" role="dialog" aria-modal="true" aria-labelledby="mfb-title">
        <h3 id="mfb-title">💬 ความคิดเห็นของคุณ</h3>
        <div class="mfb-sub">บอกเราได้เลย — ทุกความเห็นช่วย Moome ดีขึ้น</div>

        <label>คุณรู้สึกยังไงกับเว็บนี้?</label>
        <div class="mfb-moods" role="radiogroup" aria-label="mood">
          <button type="button" class="mfb-mood" data-mood="love" aria-label="ชอบมาก">😍<span class="mfb-mood-label">ชอบมาก</span></button>
          <button type="button" class="mfb-mood" data-mood="like" aria-label="ดี">🙂<span class="mfb-mood-label">ดี</span></button>
          <button type="button" class="mfb-mood" data-mood="ok"   aria-label="เฉยๆ">😐<span class="mfb-mood-label">เฉยๆ</span></button>
          <button type="button" class="mfb-mood" data-mood="bad"  aria-label="ไม่โอเค">😞<span class="mfb-mood-label">ไม่โอเค</span></button>
        </div>

        <label for="mfb-msg">เล่าให้เราฟัง</label>
        <textarea id="mfb-msg" placeholder="ติชม · เสนอ feature · พบบั๊ก · อื่นๆ" maxlength="2000"></textarea>

        <label for="mfb-email">Email (ถ้าอยากให้ตอบกลับ)</label>
        <input id="mfb-email" type="email" placeholder="you@example.com — ใส่หรือไม่ใส่ก็ได้">

        <input type="text" class="mfb-honey" name="botcheck" tabindex="-1" autocomplete="off">

        <div class="mfb-actions">
          <button class="mfb-cancel" type="button">ปิด</button>
          <button class="mfb-submit" type="button">ส่ง</button>
        </div>

        <div class="mfb-status" id="mfb-status"></div>
      </div>
    `;
    document.body.appendChild(overlay);

    let selectedMood = null;

    // Mood selection
    overlay.querySelectorAll('.mfb-mood').forEach(b => {
      b.addEventListener('click', () => {
        overlay.querySelectorAll('.mfb-mood').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        selectedMood = b.dataset.mood;
      });
    });

    // Open
    btn.addEventListener('click', () => {
      overlay.classList.add('open');
      setTimeout(() => overlay.querySelector('#mfb-msg').focus(), 100);
    });

    // Close handlers
    function close() {
      overlay.classList.remove('open');
    }
    overlay.querySelector('.mfb-cancel').addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) close();
    });

    // Submit
    const submitBtn = overlay.querySelector('.mfb-submit');
    const status = overlay.querySelector('#mfb-status');

    submitBtn.addEventListener('click', async () => {
      const msg = overlay.querySelector('#mfb-msg').value.trim();
      const email = overlay.querySelector('#mfb-email').value.trim();
      const honey = overlay.querySelector('.mfb-honey').value;

      if (!selectedMood && !msg) {
        status.className = 'mfb-status err';
        status.textContent = 'เลือก mood หรือเขียนข้อความสักนิดก่อนส่งนะ 🙏';
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'กำลังส่ง...';
      status.style.display = 'none';

      try {
        const res = await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mood: selectedMood,
            message: msg,
            email: email,
            page: location.pathname + location.search,
            ua: navigator.userAgent.substring(0, 200),
            botcheck: honey,
          }),
        });
        const data = await res.json();

        if (data.success) {
          status.className = 'mfb-status ok';
          status.textContent = '✦ ขอบคุณค่ะ — ได้รับความเห็นแล้ว';
          overlay.querySelector('#mfb-msg').value = '';
          overlay.querySelector('#mfb-email').value = '';
          overlay.querySelectorAll('.mfb-mood').forEach(x => x.classList.remove('active'));
          selectedMood = null;
          setTimeout(close, 1800);
        } else {
          throw new Error(data.error || 'ส่งไม่สำเร็จ');
        }
      } catch (err) {
        status.className = 'mfb-status err';
        status.textContent = '❌ ' + (err.message || 'ส่งไม่สำเร็จ — ลองใหม่ภายหลัง');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'ส่ง';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
