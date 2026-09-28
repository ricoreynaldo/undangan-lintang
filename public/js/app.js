(() => {
  const C = window.INVITATION;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const get = (path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), C);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  document.documentElement.classList.add('js');
  const [nameA, nameB] = C.couple.short;
  document.title = `The Wedding of ${nameA} & ${nameB}`;

  // ---------- teks & nama ----------
  $$('[data-text]').forEach((el) => { el.textContent = get(el.dataset.text) ?? ''; });
  $$('[data-names]').forEach((el) => {
    el.innerHTML = el.dataset.names === 'stack'
      ? `<span>${esc(nameA)}</span><span><em class="amp">&amp;</em> ${esc(nameB)}</span>`
      : `${esc(nameA)} <em class="amp">&amp;</em> ${esc(nameB)}`;
  });

  // ---------- foto (dengan placeholder bila file belum ada) ----------
  const phLabel = (src) => (src || '').split('/').pop() || 'foto';
  function setPhoto(img, src) {
    const holder = img.parentElement;
    const fail = () => {
      img.classList.add('ph-img');
      holder.classList.add('ph');
      holder.dataset.ph = phLabel(src);
    };
    if (!src) return fail();
    img.addEventListener('error', fail, { once: true });
    img.loading = 'lazy';
    img.src = src;
  }
  function setBg(el, src) {
    const probe = new Image();
    probe.onload = () => { el.style.backgroundImage = `url("${src}")`; };
    probe.onerror = () => el.classList.add('ph');
    if (src) probe.src = src; else el.classList.add('ph');
  }
  $$('[data-photo]').forEach((el) => {
    const src = get(el.dataset.photo);
    el.tagName === 'IMG' ? setPhoto(el, src) : setBg(el, src);
  });

  // ---------- nama tamu (?to=Nama) ----------
  const guest = new URLSearchParams(location.search).get('to');
  $('#guestName').textContent = guest ? guest.slice(0, 60) : C.cover.defaultGuest;
  if (guest) $('#rsvpName').value = guest.slice(0, 60);

  // ---------- musik ----------
  const audio = $('#bgm');
  const musicBtn = $('#musicBtn');
  if (C.music) {
    audio.src = C.music;
    audio.addEventListener('error', () => { musicBtn.hidden = true; });
    audio.addEventListener('play', () => musicBtn.classList.add('playing'));
    audio.addEventListener('pause', () => musicBtn.classList.remove('playing'));
    musicBtn.addEventListener('click', () => (audio.paused ? audio.play().catch(() => {}) : audio.pause()));
  }

  // ---------- buka undangan ----------
  const cover = $('#cover');
  $('#openBtn').addEventListener('click', () => {
    cover.classList.add('opened');
    document.body.classList.remove('locked');
    window.scrollTo(0, 0);
    if (C.music) {
      musicBtn.hidden = false;
      audio.play().catch(() => {});
    }
    setTimeout(() => { cover.style.display = 'none'; }, 1200);
  });

  // ---------- countdown ----------
  const target = new Date(C.date).getTime();
  const cd = Object.fromEntries($$('[data-cd]').map((el) => [el.dataset.cd, el]));
  const pad = (n) => String(n).padStart(2, '0');
  function tick() {
    const diff = Math.max(target - Date.now(), 0);
    const s = Math.floor(diff / 1000);
    cd.d.textContent = pad(Math.floor(s / 86400));
    cd.h.textContent = pad(Math.floor((s % 86400) / 3600));
    cd.m.textContent = pad(Math.floor((s % 3600) / 60));
    cd.s.textContent = pad(s % 60);
  }
  tick();
  setInterval(tick, 1000);

  // ---------- story ----------
  $('#story').innerHTML = C.story.map((s) => `
    <li class="reveal">
      <span class="year">${esc(s.year)}</span>
      <div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>
    </li>`).join('');

  // ---------- events ----------
  const mapQ = (e) => e.mapQuery || [e.venue, e.address].filter(Boolean).join(', ');
  $('#events').innerHTML = C.events.map((e) => `
    <article class="event reveal">
      <div class="event-info">
      <p class="eyebrow">Celebration</p>
      <h3>${esc(e.label)}</h3>
      <p class="when">${esc(e.date)}</p>
      <p class="time">${esc(e.time)}</p>
      <p class="venue">${esc(e.venue)}</p>
      <p class="addr">${esc(e.address)}</p>
      <a class="btn btn-ghost" href="${esc(e.map || 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(mapQ(e)))}" target="_blank" rel="noopener">View location <span aria-hidden="true">↗</span></a>
      </div>
      <div class="event-map">
        <iframe src="https://maps.google.com/maps?q=${encodeURIComponent(mapQ(e))}&z=15&output=embed"
          title="Peta lokasi ${esc(e.label)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
      </div>
    </article>`).join('');

  // ---------- gallery + lightbox ----------
  const gal = $('#gallery');
  const shots = C.gallery || [];
  $('#frameCount').textContent = `${pad(shots.length)} Frames`;
  gal.innerHTML = shots.map((_, i) => `<button type="button" class="reveal" data-i="${i}" aria-label="Buka foto ${i + 1}"><img alt="Galeri ${i + 1}" /></button>`).join('');
  $$('img', gal).forEach((img, i) => setPhoto(img, shots[i]));

  const lb = $('#lightbox');
  const lbImg = $('img', lb);
  let cur = 0;
  const available = () => $$('button', gal).filter((b) => !b.classList.contains('ph')).map((b) => Number(b.dataset.i));
  function show(i) {
    const list = available();
    if (!list.length) return;
    const pos = (list.indexOf(i) + list.length) % list.length;
    cur = list[pos === -1 ? 0 : pos];
    lbImg.src = shots[cur];
    lb.hidden = false;
  }
  function step(d) {
    const list = available();
    const pos = list.indexOf(cur);
    cur = list[(pos + d + list.length) % list.length];
    lbImg.src = shots[cur];
  }
  gal.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (b && !b.classList.contains('ph')) show(Number(b.dataset.i));
  });
  $('.lb-close', lb).addEventListener('click', () => { lb.hidden = true; });
  $('.lb-nav.prev', lb).addEventListener('click', () => step(-1));
  $('.lb-nav.next', lb).addEventListener('click', () => step(1));
  lb.addEventListener('click', (e) => { if (e.target === lb) lb.hidden = true; });
  document.addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') lb.hidden = true;
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  // ---------- gift ----------
  const g = C.gift || {};
  const cards = [];
  // Logo diatur lewat `logo` / `addressIcon` di config.js (file di public/images/).
  // File kosong / tidak ditemukan → kotak logo disembunyikan.
  const logoHTML = (src, alt) => (src
    ? `<span class="gift-logo"><img src="${esc(src)}" alt="${esc(alt)}" onerror="this.parentNode.remove()" /></span>`
    : '');
  const giftSvg = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12v9H4v-9M2 7h20v5H2zM12 21V7M12 7H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7z"/></svg>`;
  (g.accounts || []).forEach((a) => {
    const wallet = a.type === 'ewallet';
    cards.push(`
    <article class="gift reveal">
      <div class="gift-head">
        <p class="eyebrow">${wallet ? 'E-wallet' : 'Bank transfer'}</p>
        ${logoHTML(a.logo, 'Logo ' + a.name)}
      </div>
      <h3>${esc(a.name)}</h3>
      <span class="label">${wallet ? 'Phone number' : 'Account number'}</span>
      <p class="acc">${esc(a.number)}</p>
      <p class="holder">a.n. ${esc(a.holder)}</p>
      <button class="btn btn-ghost" type="button" data-copy="${esc(String(a.number).replace(/[\s-]/g, ''))}">Copy ${wallet ? 'number' : 'account number'}</button>
    </article>`);
  });
  if (g.qris) cards.push(`
    <article class="gift reveal">
      <p class="eyebrow">Digital payment</p>
      <h3>QRIS</h3>
      <div class="qris-wrap"><img class="qris" alt="Kode QRIS" data-qris /></div>
    </article>`);
  if (g.address) cards.push(`
    <article class="gift reveal">
      <div class="gift-head">
        <p class="eyebrow">Send a gift</p>
        ${g.addressIcon ? logoHTML(g.addressIcon, 'Ikon kado').replace('gift-logo', 'gift-logo is-icon') : `<span class="gift-icon">${giftSvg}</span>`}
      </div>
      <h3>Delivery address</h3>
      <address>${esc(g.addressRecipient ? g.addressRecipient + ' — ' : '')}${esc(g.address)}</address>
      <button class="btn btn-ghost" type="button" data-copy="${esc(g.address)}">Copy address</button>
    </article>`);
  $('#gifts').innerHTML = cards.join('');
  const qris = $('[data-qris]');
  if (qris) setPhoto(qris, g.qris);

  const toast = $('#toast');
  let toastT;
  function notify(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(() => toast.classList.remove('show'), 2200);
  }
  document.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-copy]');
    if (!b) return;
    try {
      await navigator.clipboard.writeText(b.dataset.copy);
      notify('Tersalin ke clipboard');
    } catch {
      notify('Gagal menyalin — salin manual ya');
    }
  });

  // ---------- RSVP & guestbook ----------
  const form = $('#rsvpForm');
  const msg = $('#rsvpMsg');
  const guestsField = $('#guestsField');
  form.addEventListener('change', (e) => {
    if (e.target.name === 'attendance') guestsField.hidden = e.target.value === 'tidak';
  });

  const list = $('#wishes');
  const more = $('#moreWishes');
  const PAGE = 10;
  let cursor = null;
  const fmtTime = (d) => (d ? d.toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '');
  const wishHTML = (w) => `
    <li>
      <div class="wish-top">
        <span class="wish-name">${esc(w.name)}</span>
        <span class="wish-tag">${w.attendance === 'hadir' ? 'Hadir' : 'Tidak hadir'}</span>
      </div>
      <p class="wish-msg">${esc(w.message)}</p>
      <p class="wish-time">${esc(fmtTime(w.createdAt))}</p>
    </li>`;

  // db.js (ES module, Firebase) memasang window.RSVP_DB lalu memicu 'db-ready'
  const dbReady = new Promise((resolve, reject) => {
    if (window.RSVP_DB) return resolve(window.RSVP_DB);
    window.addEventListener('db-ready', () => resolve(window.RSVP_DB), { once: true });
    setTimeout(() => reject(new Error('Koneksi database gagal dimuat.')), 15000);
  });

  // Firestore bisa "menggantung" (mis. database belum dibuat / offline) — beri batas waktu
  const withTimeout = (p, ms = 12000) => Promise.race([
    p, new Promise((_, rej) => setTimeout(() => rej(new Error('Guestbook belum dapat dimuat.')), ms)),
  ]);

  async function loadStats() {
    try {
      const { hadir, tidak, ucapan } = await withTimeout((await dbReady).stats());
      $('#gbStats').textContent = `${hadir} hadir · ${tidak} berhalangan · ${ucapan} ucapan`;
    } catch { $('#gbStats').textContent = ''; }
  }

  async function loadWishes(reset) {
    if (reset) { cursor = null; list.innerHTML = '<li class="empty">Memuat ucapan…</li>'; }
    more.disabled = true;
    try {
      const db = await dbReady;
      const res = await withTimeout(db.page(PAGE, cursor));
      cursor = res.cursor;
      list.querySelector('.empty')?.remove();
      list.insertAdjacentHTML('beforeend', res.items.map(wishHTML).join(''));
      more.hidden = res.done;
      if (!list.children.length) list.innerHTML = '<li class="empty">Jadilah yang pertama mengirim ucapan.</li>';
    } catch (err) {
      console.error(err);
      if (reset) list.innerHTML = `<li class="empty">${esc(err.message || 'Guestbook belum dapat dimuat.')}</li>`;
      more.hidden = true;
    } finally {
      more.disabled = false;
    }
  }
  more.addEventListener('click', () => loadWishes(false));
  loadWishes(true);
  loadStats();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    msg.className = 'form-msg';
    if (!data.name?.trim()) { msg.textContent = 'Mohon isi nama Anda.'; return; }
    if (!data.attendance) { msg.textContent = 'Mohon pilih konfirmasi kehadiran.'; return; }
    const btn = $('button[type=submit]', form);
    btn.disabled = true;
    try {
      await withTimeout((await dbReady).add(data), 15000);
      msg.textContent = 'Terima kasih! Konfirmasi Anda sudah kami terima.';
      msg.classList.add('ok');
      form.message.value = '';
      loadWishes(true);
      loadStats();
    } catch (err) {
      console.error(err);
      msg.textContent = err.message?.includes('Firebase belum') ? err.message : 'Gagal mengirim, coba lagi.';
    } finally {
      btn.disabled = false;
    }
  });

  // ---------- reveal on scroll ----------
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  $$('.reveal').forEach((el) => io.observe(el));
})();
