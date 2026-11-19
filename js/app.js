'use strict';
/* goed bezig: the game. One file, no build step.
   Bump VERSION on every change (and the ?v= in index.html, and CACHE in sw.js). */
const VERSION = { name: 'GOED BEZIG', v: '1.3.0', date: '2026-11-19', note: 'sync between phone and laptop' };
const SYNC_READY = true;   // flips to true once the Google Sheet backend exists
const KEY = 'goedbezig.v1';
const DAY = 864e5;

/* ------------------------------------------------------------------ helpers */
const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const rnd = a => a[Math.floor(Math.random() * a.length)];
const pad = n => String(n).padStart(2, '0');
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function dkey(d = new Date()) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
function dayStart(ts) { const d = new Date(ts); d.setHours(0, 0, 0, 0); return d.getTime(); }
function fill(s, extra = {}) {
  return s.replace(/\{(\w+)\}/g, (m, k, at) => {
    const v = k === 'name' ? S.name : k === 'dog' ? (S.dog || 'mijn hond') : k === 'dogEn' ? (S.dog || 'my dog') : (k in extra ? extra[k] : m);
    return at === 0 && typeof v === 'string' ? v.charAt(0).toUpperCase() + v.slice(1) : v;
  });
}

/* -------------------------------------------------------------------- icons */
const ICONS = {
  bubble: 'M4 5h16v11H10l-5 4v-4H4z',
  blocks: 'M4 4h7v7H4z M13 13h7v7h-7z M13 4h7v7h-7z M4 13h7v7H4z',
  people: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6 M16 5.2a3 3 0 0 1 0 5.6 M18 14.3c1.8.9 3 2.9 3 5.7',
  bolt: 'M13 2L4 14h7l-1 8 9-12h-7z',
  house: 'M3 11l9-8 9 8 M5 9.500V21h14V9.5 M10 21v-6h4v6',
  cup: 'M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z M17 11h1.500a2.500 2.500 0 0 1 0 5H16 M8 3v3 M12 3v3',
  hash: 'M9 3L7 21 M17 3l-2 18 M4 9h17 M3 15h17',
  heart: 'M12 21s-8-5.300-8-11a4.500 4.500 0 0 1 8-2.800A4.500 4.500 0 0 1 20 10c0 5.700-8 11-8 11z',
  smile: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M8.500 14.500c1 1.300 2.200 2 3.500 2s2.500-.700 3.500-2 M9 9.500v.600 M15 9.500v.600',
  paw: 'M12 13c-2.800 0-5 2-5 4.200 0 1.600 1.200 2.300 2.600 2.300.900 0 1.500-.400 2.400-.400s1.500.400 2.400.400c1.400 0 2.600-.700 2.600-2.300 0-2.200-2.200-4.200-5-4.200z M5.500 11.500a1.500 1.500 0 1 0 0-3 1.500 1.500 0 0 0 0 3z M9.500 7.500a1.500 1.500 0 1 0 0-3 1.500 1.500 0 0 0 0 3z M14.500 7.500a1.500 1.500 0 1 0 0-3 1.500 1.500 0 0 0 0 3z M18.500 11.500a1.500 1.500 0 1 0 0-3 1.500 1.500 0 0 0 0 3z',
  bike: 'M6 19a3.500 3.500 0 1 0 0-7 3.500 3.500 0 0 0 0 7z M18 19a3.500 3.500 0 1 0 0-7 3.500 3.500 0 0 0 0 7z M6 15.500l4-7h5l3 7 M10 8.500l2 7 M9 6h3 M15 8.500l-1-3h2.500',
  note: 'M9 18V5l11-2v13 M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0z M20 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
  calendar: 'M4 6h16v14H4z M4 10h16 M8 3v5 M16 3v5',
  fries: 'M7 11l2.500 10h5L17 11z M9.500 11V4 M12 11V3 M14.500 11V5',
  apple: 'M12 7.500c-2.200-1.600-6-1-6 4 0 4 2.500 8.500 6 8.500s6-4.500 6-8.500c0-5-3.800-5.600-6-4z M12 7.500c0-2 1-3.500 3-4.500',
  leaf: 'M5 19C5 10 10 5 20 4c-1 10-6 15-15 15z M5 19l8-8',
  bowl: 'M3 11h18a9 9 0 0 1-18 0z M8 7c0-2 2-2 2-4 M13 7c0-2 2-2 2-4',
  fish: 'M3 12c3-5 9-6 13-3l5-3v8l-5-3c-4 3-10 2-13-3z M7.500 11.500v.600',
  brush: 'M4 20c0-2 1-3.500 3-3.500s2.500 1 2.500 2.500C9.500 20.500 7 21 4 20z M9.500 16.500L19 4l1.500 1.500L11.500 18',
  wafel: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z M9 3v18 M15 3v18 M3 9h18 M3 15h18',
  flame: 'M12 22c4 0 7-2.900 7-6.800 0-3-1.800-5-3.400-6.900-.500 1.500-1.200 2.300-2.200 2.900.200-3.500-1.300-6.600-4.400-9.200.200 3-1 4.800-2.300 6.600C5.600 10.200 5 12.300 5 15.200 5 19.100 8 22 12 22z',
  speaker: 'M4 9v6h4l5 4V5L8 9z M16 9a4 4 0 0 1 0 6 M18.500 6.500a8 8 0 0 1 0 11',
  x: 'M6 6l12 12 M18 6L6 18',
  check: 'M4 12.500l5 5L20 6.500',
  lock: 'M6 11h12v9H6z M8.500 11V7.500a3.500 3.500 0 0 1 7 0V11',
  arrow: 'M5 12h14 M13 6l6 6-6 6',
  back: 'M19 12H5 M11 6l-6 6 6 6',
  route: 'M12 22V3 M12 5h7l2 2.500-2 2.500h-7 M12 12H5l-2 2.500L5 17h7',
  chart: 'M4 20V10 M10 20V4 M16 20v-8 M21 20H3',
  star: 'M12 3l2.700 5.600 6.100.800-4.500 4.300 1.100 6.100L12 16.900 6.600 19.800l1.100-6.100L3.200 9.400l6.100-.800z',
  sliders: 'M4 7h10 M18 7h2 M4 17h2 M10 17h10 M16 5v4 M8 15v4'
};
function icon(name, cls = '') {
  return `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${ICONS[name] || ''}"/></svg>`;
}
function wafelArt() {
  return '<svg class="wart" viewBox="0 0 96 96" aria-hidden="true"><rect x="8" y="8" width="80" height="80" rx="17"/><path d="M34.700 8v80 M61.300 8v80 M8 34.700h80 M8 61.300h80"/></svg>';
}
function dogSVG(mood = '') {
  return `<svg class="dog ${mood}" viewBox="0 0 120 104" aria-hidden="true">
    <path class="ear l" d="M32 26C12 22 4 54 16 72c9-5 16-17 20-32z"/>
    <path class="ear r" d="M88 26c20-4 28 28 16 46-9-5-16-17-20-32z"/>
    <rect class="head" x="24" y="14" width="72" height="76" rx="34"/>
    <circle class="patch" cx="45" cy="46" r="15"/>
    <circle class="eye" cx="46" cy="46" r="4.500"/><circle class="eye" cx="76" cy="46" r="4.500"/>
    <ellipse class="snout" cx="60" cy="68" rx="19" ry="14"/>
    <ellipse class="nose" cx="60" cy="61" rx="6.500" ry="4.800"/>
    <path class="tongue" d="M54 75c1 9 11 9 12 0z"/>
    <path class="mouth" d="M60 66v6 M51 73c5 5 13 5 18 0"/>
  </svg>`;
}

/* --------------------------------------------------------------------- data */
const WORDS = [], SENTS = [], BYID = {};
const PALETTE = ['pink', 'yellow', 'teal', 'orange', 'cyan', 'green', 'sky'];
PLACES.forEach((p, pi) => {
  p.index = pi; p.color = PALETTE[pi % PALETTE.length];
  p.items = p.words.map(([nl, en, flag]) => {
    const m = nl.match(/^(de|het) (\S+)$/);
    const w = {
      id: p.id + ':' + nl, nl, en, place: p, art: m ? m[1] : null, bare: m ? m[2] : nl, plural: flag === 'p',
      parts: en.toLowerCase().split(' / ').map(s => s.trim()),
      kind: m ? 'noun' : /^to /.test(en) ? 'verb' : 'other'
    };
    WORDS.push(w); BYID[w.id] = w; return w;
  });
  p.sents = p.sentences.map(([nl, en], i) => { const s = { id: p.id + '#' + i, nl, en, place: p }; SENTS.push(s); return s; });
});

const TOTAL = WORDS.length;

/* -------------------------------------------------------------------- state */
function fresh() {
  return {
    v: 1, name: 'Anna', dog: '', pace: 20, sound: true, voice: true, openAll: false, onboarded: false,
    items: {}, sents: {}, wafels: 0, streak: { n: 0, best: 0, last: '' }, days: {}, stickers: {},
    dehetBest: 0, zinnen: 0, walks: 0, bestCombo: 0, started: dkey(), epoch: 0, setT: 0
  };
}
function load() {
  try { const raw = localStorage.getItem(KEY); if (raw) return Object.assign(fresh(), JSON.parse(raw)); } catch (e) { /* private mode */ }
  return fresh();
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* storage full or blocked */ } }
let S = load();
if (!S.m12) { if (S.dog === 'Wafel') S.dog = ''; S.m12 = 1; }

const box = w => (S.items[w.id] ? S.items[w.id].b : 0);
function R(w) { return S.items[w.id] || (S.items[w.id] = { b: 0, due: 0, ok: 0, bad: 0 }); }
const GAPS = [0, 10 * 60e3, DAY, 3 * DAY, 7 * DAY, 21 * DAY];
function promote(w) { const r = R(w); r.b = Math.min(5, r.b + 1); r.ok++; r.t = Date.now(); r.due = r.b <= 1 ? Date.now() + GAPS[1] : dayStart(Date.now()) + GAPS[r.b]; }
function demote(w) { const r = R(w); r.b = Math.max(1, r.b - 1); r.bad++; r.t = Date.now(); r.due = Date.now(); }
const isMet = w => box(w) >= 1, isKnown = w => box(w) >= 3, isByHeart = w => box(w) >= 4;
const count = (list, fn) => list.reduce((n, w) => n + (fn(w) ? 1 : 0), 0);
const placeOpen = () => true;                       // v1.1: every place is open from the start
const isSorted = w => box(w) >= 1 || !!(S.items[w.id] || {}).s;
const unsorted = () => WORDS.filter(w => !isSorted(w));
function today() { return S.days[dkey()] || (S.days[dkey()] = { a: 0, c: 0, n: 0, w: 0 }); }
function levelIndex(w = S.wafels) { let i = 0; LEVELS.forEach((l, k) => { if (w >= l.at) i = k; }); return i; }
function dueWords(pool = WORDS) { const now = Date.now(); return pool.filter(w => { const r = S.items[w.id]; return r && r.b >= 1 && r.due <= now; }); }
function touchStreak() {
  const t = dkey(); if (S.streak.last === t) return;
  const y = dkey(new Date(Date.now() - DAY));
  S.streak.n = S.streak.last === y ? S.streak.n + 1 : 1;
  S.streak.last = t; S.streak.best = Math.max(S.streak.best, S.streak.n);
}
function liveStreak() { const t = dkey(), y = dkey(new Date(Date.now() - DAY)); return (S.streak.last === t || S.streak.last === y) ? S.streak.n : 0; }

/* ------------------------------------------------------------ sound + voice */
let actx = null;
function tone(freq, t0, dur, type = 'sine', vol = 0.12) {
  if (!S.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === 'suspended') actx.resume();
    const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + t0;
    o.type = type; o.frequency.value = freq; g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(actx.destination); o.start(t); o.stop(t + dur + 0.02);
  } catch (e) { /* no audio */ }
}
const sfx = {
  ok() { tone(660, 0, 0.12); tone(880, 0.09, 0.18); },
  bad() { tone(196, 0, 0.22, 'triangle', 0.14); },
  tap() { tone(520, 0, 0.05, 'sine', 0.05); },
  win() { [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.22)); }
};
function buzz(ms) { if (S.sound && navigator.vibrate) { try { navigator.vibrate(ms); } catch (e) { /* ignore */ } } }
let voice = null;
function pickVoice() {
  if (!('speechSynthesis' in window)) return;
  const vs = speechSynthesis.getVoices();
  voice = vs.find(v => /^nl[-_]BE/i.test(v.lang)) || vs.find(v => /^nl/i.test(v.lang)) || null;
}
if ('speechSynthesis' in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
function say(text, force) {
  if (!voice || (!S.voice && !force)) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[{}]/g, ''));
    u.voice = voice; u.lang = voice.lang; u.rate = 0.88; speechSynthesis.speak(u);
  } catch (e) { /* ignore */ }
}

/* ----------------------------------------------------------------- confetti */
function confetti() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const c = $('#confetti'), x = c.getContext('2d'), W = c.width = innerWidth, H = c.height = innerHeight;
  const cols = ['#FF0F6C', '#F05A28', '#FFAE00', '#7FAD5C', '#2BBFB3', '#29B8DC', '#00AEEF'];
  const ps = Array.from({ length: 90 }, () => ({ x: W / 2 + (Math.random() - 0.5) * 80, y: H * 0.38, vx: (Math.random() - 0.5) * 13, vy: -Math.random() * 13 - 3, s: 6 + Math.random() * 7, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, c: rnd(cols) }));
  const t0 = performance.now();
  (function frame(t) {
    const k = (t - t0) / 1700; x.clearRect(0, 0, W, H);
    if (k >= 1) return;
    ps.forEach(p => { p.vy += 0.42; p.x += p.vx; p.y += p.vy; p.r += p.vr; x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.globalAlpha = 1 - k * k; x.fillStyle = p.c; x.fillRect(-p.s / 2, -p.s / 2, p.s, p.s); x.restore(); });
    requestAnimationFrame(frame);
  })(t0);
}

/* --------------------------------------------------------------------- sync
   Optional. A device is linked with a sync code (web app id ~ secret). Every sync is
   pull, merge, push: words keep whichever device answered last, counters add up what
   each device earned since its last sync, so two devices never overwrite each other. */
let syncBusy = false, syncQueued = false, syncErr = '', syncTimer = null;
const recentDay = k => k >= dkey(new Date(Date.now() - 2 * DAY));
function syncUrl() { return (location.hostname === 'localhost' && localStorage.getItem('goedbezig.testSyncUrl')) || `https://script.google.com/macros/s/${S.sync.id}/exec`; }
function stripSync(st) { const o = Object.assign({}, st); delete o.sync; return o; }
function snapshot(st) {
  const days = {};
  Object.keys(st.days || {}).filter(recentDay).forEach(k => { days[k] = Object.assign({}, st.days[k]); });
  return { wafels: st.wafels || 0, zinnen: st.zinnen || 0, walks: st.walks || 0, days };
}
function newer(a, b) {
  const ta = a.t || 0, tb = b.t || 0;
  return ta !== tb ? ta > tb : ((a.ok || 0) + (a.bad || 0) + (a.b || 0)) >= ((b.ok || 0) + (b.bad || 0) + (b.b || 0));
}
function runOfDays(days, last) {
  let n = 0, d = new Date(last + 'T12:00:00');
  while (days[dkey(d)] && days[dkey(d)].a > 0) { n++; d = new Date(d.getTime() - DAY); }
  return n;
}
function mergeState(L, Rm, base) {
  if (!Rm || typeof Rm !== 'object' || typeof Rm.items !== 'object') return Object.assign({}, L);
  if ((Rm.epoch || 0) !== (L.epoch || 0)) {          // one side started over or restored a backup: the newest of those wins whole
    return (Rm.epoch || 0) > (L.epoch || 0) ? Object.assign(fresh(), Rm, { sound: L.sound, voice: L.voice, sync: L.sync }) : Object.assign({}, L);
  }
  base = base || {};
  const o = Object.assign({}, L), plus = (x, b0) => Math.max(0, (x || 0) - (b0 || 0));
  ['items', 'sents'].forEach(k => {
    const m = Object.assign({}, Rm[k] || {});
    Object.keys(L[k] || {}).forEach(id => { if (!m[id] || newer(L[k][id], m[id])) m[id] = L[k][id]; });
    o[k] = m;
  });
  ['wafels', 'zinnen', 'walks'].forEach(k => { o[k] = (Rm[k] || 0) + plus(L[k], base[k]); });
  const days = {}, bd = base.days || {};
  Object.keys(Rm.days || {}).forEach(k => { days[k] = Object.assign({}, Rm.days[k]); });
  Object.keys(L.days || {}).forEach(k => {
    const l = L.days[k], r = days[k];
    if (!r) { days[k] = Object.assign({}, l); return; }
    const sum = (k in bd) || recentDay(k);
    ['a', 'c', 'n', 'w'].forEach(x => { r[x] = sum ? (r[x] || 0) + plus(l[x], (bd[k] || {})[x]) : Math.max(r[x] || 0, l[x] || 0); });
  });
  o.days = days;
  o.dehetBest = Math.max(L.dehetBest || 0, Rm.dehetBest || 0);
  o.bestCombo = Math.max(L.bestCombo || 0, Rm.bestCombo || 0);
  const ls = L.streak || {}, rs = Rm.streak || {}, last = [ls.last || '', rs.last || ''].sort()[1];
  const pick = (rs.last || '') === last && (rs.n || 0) >= ((ls.last || '') === last ? (ls.n || 0) : 0) ? rs : ls;
  const n = last ? Math.max(pick.n || 0, runOfDays(days, last)) : 0;
  o.streak = { n, last, best: Math.max(ls.best || 0, rs.best || 0, n) };
  o.stickers = Object.assign({}, Rm.stickers || {});
  Object.keys(L.stickers || {}).forEach(k => { if (!o.stickers[k] || L.stickers[k] < o.stickers[k]) o.stickers[k] = L.stickers[k]; });
  if ((Rm.setT || 0) > (L.setT || 0) || (!L.onboarded && Rm.onboarded)) ['name', 'dog', 'pace', 'openAll', 'setT'].forEach(k => { if (k in Rm) o[k] = Rm[k]; });
  o.onboarded = !!(L.onboarded || Rm.onboarded);
  o.started = [L.started, Rm.started].filter(Boolean).sort()[0] || dkey();
  return o;
}
function sheetSummary(st) {
  const b = w => (st.items[w.id] || {}).b || 0, d = (st.days || {})[dkey()] || {};
  return { date: dkey(), met: count(WORDS, w => b(w) >= 1), known: count(WORDS, w => b(w) >= 3), byHeart: count(WORDS, w => b(w) >= 4),
    wafels: st.wafels || 0, level: LEVELS[levelIndex(st.wafels || 0)].nl, streak: (st.streak || {}).n || 0, answers: d.a || 0, right: d.c || 0,
    device: matchMedia('(pointer:coarse)').matches ? 'phone' : 'computer' };
}
function sheetWords(st) {
  return WORDS.map(w => { const r = st.items[w.id] || {}, b = r.b || 0;
    return [w.place.nl, w.nl, w.en, b, b >= 4 ? 'by heart' : b >= 3 ? 'known' : b >= 1 ? 'met' : 'new', r.ok || 0, r.bad || 0, b >= 1 && r.due ? dkey(new Date(r.due)) : '']; });
}
const fingerprint = st => [st.wafels, Object.keys(st.items).length, Object.values(st.items).reduce((t, r) => t + (r.b || 0), 0), (st.streak || {}).n, st.name, st.dog, st.pace, st.openAll, Object.keys(st.stickers).length, st.onboarded].join('|');
async function syncCall(body) {
  let r;
  try { r = await fetch(syncUrl(), { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(Object.assign({ key: S.sync.key }, body)) }); }
  catch (e) { throw new Error('no connection'); }
  if (!r.ok) throw new Error('the Sheet did not answer (' + r.status + ')');
  let j; try { j = await r.json(); } catch (e) { throw new Error('the Sheet sent something unexpected'); }
  if (!j.ok && !j.conflict) throw new Error(j.error || 'sync failed');
  return j;
}
async function syncNow() {
  if (!S.sync) return false;
  if (syncBusy) { syncQueued = true; return false; }
  syncBusy = true; syncErr = ''; paintSync();
  let done = false;
  try {
    let remote = await syncCall({ action: 'pull' });
    for (let i = 0; i < 4 && !done; i++) {
      const snap0 = snapshot(S), merged = mergeState(S, remote.state, S.sync.base);
      const res = await syncCall({ action: 'push', baseRev: remote.rev, state: stripSync(merged), summary: sheetSummary(merged), words: sheetWords(merged) });
      if (res.conflict) { remote = res; continue; }
      if (!S.sync) return false;                      // unlinked while the request was out
      const before = fingerprint(S);
      const fin = mergeState(S, merged, snap0);        // keeps whatever was played while the request was out
      fin.sync = Object.assign({}, S.sync, { rev: res.rev, at: Date.now(), base: snapshot(merged) });
      S = fin; save(); done = true;
      if (fingerprint(S) !== before) {
        if (['home', 'progress', 'stickers', 'place'].includes(view.name)) { const y = window.scrollY; go(view.name, view.arg); window.scrollTo(0, y); }
        else if (view.name === 'hello' && S.onboarded) go('home');
      }
    }
    if (!done) throw new Error('the Sheet was busy, will try again');
  } catch (e) { syncErr = e.message || 'sync failed'; }
  syncBusy = false; paintSync();
  if (syncQueued) { syncQueued = false; syncSoon(); }
  return done;
}
function syncSoon() { if (!S.sync) return; clearTimeout(syncTimer); syncTimer = setTimeout(syncNow, 1200); }
function syncText() {
  if (syncBusy) return 'Syncing with your Google Sheet…';
  if (syncErr) return `Sync did not work just now: ${esc(syncErr)}. Your progress is safe on this device and goes up at the next try.`;
  if (!S.sync.at) return 'Linked. Not synced yet.';
  const m = Math.round((Date.now() - S.sync.at) / 60000);
  return `Linked to your Google Sheet. Last synced ${m < 1 ? 'just now' : m < 60 ? m + (m === 1 ? ' minute ago' : ' minutes ago') : new Date(S.sync.at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}.`;
}
function paintSync() {
  document.body.dataset.sync = !S.sync ? 'off' : syncBusy ? 'busy' : syncErr ? 'error' : 'ok';
  const el = $('#syncStatus'); if (el && S.sync) el.innerHTML = syncText();
}
function parseCode(str) { const m = String(str).trim().match(/(?:#sync=)?([A-Za-z0-9_-]{30,})~([A-Za-z0-9]{24,})$/); return m ? { id: m[1], key: m[2] } : null; }
function linkDevice(c) { S.sync = { id: c.id, key: c.key, rev: 0, at: 0, base: {} }; save(); paintSync(); }
function syncBlock() {
  if (!S.sync) return `<h2 class="h">sync</h2>
    <p class="fine pad">Same progress on your phone and your laptop, kept in your own Google Sheet. Paste your sync code to link this device.</p>
    <form class="set" data-form="link"><label>sync code<input name="code" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="paste it here"></label>
      <button class="btn btn-ghost">link this device</button></form>`;
  return `<h2 class="h">sync</h2>
    <p class="fine pad" id="syncStatus">${syncText()}</p>
    <div class="actions">
      <button class="btn btn-ghost" data-act="syncnow">sync now</button>
      <button class="btn btn-ghost" data-act="synccode">copy the sync code for another device</button>
      <button class="btn btn-clear danger" data-act="unlink">unlink this device</button>
    </div>`;
}

/* ------------------------------------------------------------------- router */
let view = { name: 'home', arg: null };
let timers = [], ticker = null;
function later(fn, ms) { const id = setTimeout(fn, ms); timers.push(id); return id; }
function clearTimers() { timers.forEach(clearTimeout); timers = []; if (ticker) { clearInterval(ticker); ticker = null; } }
function go(name, arg = null) {
  clearTimers(); view = { name, arg };
  document.body.dataset.view = name;
  $('#app').innerHTML = VIEWS[name](arg);
  renderNav(); window.scrollTo(0, 0);
  if (AFTER[name]) AFTER[name](arg);
}
const NAV = [['home', 'route', 'route'], ['progress', 'chart', 'vooruitgang'], ['stickers', 'star', 'stickers'], ['settings', 'sliders', 'instellingen']];
function renderNav() {
  const show = ['home', 'progress', 'stickers', 'settings', 'place'].includes(view.name);
  const nav = $('#nav'); nav.hidden = !show; if (!show) return;
  const cur = view.name === 'place' ? 'home' : view.name;
  nav.innerHTML = NAV.map(([v, ic, label]) => `<button data-act="go" data-to="${v}" class="${cur === v ? 'on' : ''}" ${cur === v ? 'aria-current="page"' : ''}>${icon(ic)}<span>${label}</span></button>`).join('');
}
const versionLine = () => `<footer class="version">${VERSION.name} · v${VERSION.v} · ${VERSION.date} · ${VERSION.note}</footer>`;
function wordHTML(w) { return w.art ? `<span class="art ${w.art}">${w.art}</span> ${esc(w.bare)}` : esc(w.nl); }
const sizeCls = s => (s.length <= 11 ? '' : s.length <= 19 ? 'md' : 'sm');

/* --------------------------------------------------------------------- home */
function walkPlan() {
  const due = dueWords().length;
  const unmet = count(WORDS, w => !isMet(w));
  const fresh = Math.max(0, Math.min(10, S.pace - today().n, unmet));
  return { due, unmet, fresh };
}
const VIEWS = {}, AFTER = {};

VIEWS.home = () => {
  const plan = walkPlan(), li = levelIndex(), lvl = LEVELS[li], next = LEVELS[li + 1];
  const pct = next ? Math.round(100 * (S.wafels - lvl.at) / (next.at - lvl.at)) : 100;
  let line, cta, sub, act = 'walk';
  if (plan.due + plan.fresh > 0) {
    line = plan.due > 0 && Math.random() < 0.6 ? fillLine(rnd(DOG_LINES.due), { n: plan.due }) : fillLine(rnd(DOG_LINES.hello));
    if (!Object.keys(S.items).length) line = ['Ken je al woorden? Doe eerst de sneltest.', 'Know some words already? Do the quick test first.'];
    cta = 'start de wandeling';
    sub = [plan.due ? `${Math.min(plan.due, 24)} to repeat` : '', plan.fresh ? `${plan.fresh} new` : ''].filter(Boolean).join(', ');
  } else if (plan.unmet > 0) {
    line = fillLine(rnd(DOG_LINES.done)); cta = 'nog een rondje'; sub = 'today is done. 10 extra new words?'; act = 'extra';
  } else {
    line = fillLine(rnd(DOG_LINES.done)); cta = 'vrij oefenen'; sub = 'nothing is due. practise anyway?'; act = 'extra';
  }
  const current = PLACES.find(p => placeOpen(p) && count(p.items, isMet) < p.items.length) || null;
  return `
  <header class="top">
    <div class="brand">goed bezig</div>
    <div class="counters">
      <button class="count" data-act="go" data-to="progress" aria-label="${liveStreak()} days in a row">${icon('flame')}<b>${liveStreak()}</b></button>
      <button class="count wafels" data-act="go" data-to="stickers" aria-label="${S.wafels} wafels">${icon('wafel')}<b>${S.wafels}</b></button>
    </div>
  </header>
  <section class="greet"><p class="nl">${esc(line[0])}</p><p class="en">${esc(line[1])}</p></section>
  <button class="btn btn-pink cta" data-act="${act}"><span class="stack">${cta}<em>${sub}</em></span>${icon('arrow')}</button>
  <section class="level">
    <div class="lvl-row"><h2>${lvl.nl}</h2><span class="lvl-en">${lvl.en}</span></div>
    <div class="bar"><i style="width:${pct}%"></i></div>
    <p class="fine">${next ? `${next.at - S.wafels} wafels to go until <b>${next.nl}</b>` : 'the top of the ladder. amai.'}</p>
  </section>
  <div class="duo">
    ${unsorted().length ? `<button class="tile band c-cyan" data-act="sorteer"><span><h3>sneltest</h3><p>know some already? one tap per word sorts them all</p></span><span class="rec">${TOTAL - unsorted().length}/${TOTAL}</span></button>` : ''}
    <button class="tile c-teal" data-act="dehet"><h3>de of het?</h3><p>45 seconds of nouns</p><span class="rec">record ${S.dehetBest}</span></button>
    <button class="tile c-yellow" data-act="zinnen"><h3>zinnen bouwen</h3><p>${SENTS.length} sentences, all open</p><span class="rec">${S.zinnen} built</span></button>
  </div>
  <h2 class="h">de route</h2>
  <ol class="route">${PLACES.map(p => placeCard(p, current)).join('')}</ol>
  <p class="aside">${TOTAL} woorden. allez, we gaan.</p>
  ${versionLine()}`;
};
function fillLine(l, extra) { return [fill(l[0], extra), fill(l[1], extra)]; }
function placeCard(p, current) {
  const met = count(p.items, isMet), tot = p.items.length;
  const won = S.stickers['boss:' + p.id];
  return `<li><button class="place c-${p.color}" data-act="place" data-id="${p.id}">
    <span class="pi">${icon(p.icon)}</span>
    <span class="pt"><b>${esc(p.nl)}</b><small>${esc(p.en)}</small></span>
    <span class="pn">${met}/${tot}</span>
    <span class="pbar"><i style="width:${Math.round(100 * met / tot)}%"></i></span>
    ${won ? `<span class="won" title="boss beaten">${icon('star')}</span>` : ''}
    ${current === p ? '<span class="here">hier</span>' : ''}
  </button></li>`;
}

/* -------------------------------------------------------------------- place */
VIEWS.place = id => {
  const p = PLACES.find(x => x.id === id), met = count(p.items, isMet), vb = count(p.items, isByHeart), tot = p.items.length;
  const bossReady = met === tot, won = S.stickers['boss:' + p.id];
  return `
  <section class="hero c-${p.color}">
    <button class="x" data-act="go" data-to="home" aria-label="back">${icon('back')}</button>
    <div class="hero-ic">${p.id === 'hond' ? dogSVG('happy') : icon(p.icon)}</div>
    <h1>${esc(p.nl)}</h1>
    <p>${esc(p.en)}</p>
    <div class="hero-stats"><span><b>${met}</b> of ${tot} met</span><span><b>${vb}</b> by heart</span></div>
  </section>
  <div class="actions">
    <button class="btn btn-pink" data-act="practise" data-id="${p.id}"><span class="stack">oefen deze plek<em>practise only these words</em></span>${icon('arrow')}</button>
    <button class="btn btn-ghost" data-act="boss" data-id="${p.id}" ${bossReady ? '' : 'disabled'}>
      <span class="stack">${won ? 'nog eens tegen' : 'daag uit:'} ${esc(p.boss.who)}<em>${bossReady ? 'the boss round: 12 questions, 3 lives' : `meet all ${tot} words first`}</em></span>${icon(bossReady ? 'bolt' : 'lock')}</button>
  </div>
  <h2 class="h">woorden</h2>
  <ul class="words">${p.items.map(w => `<li><button data-act="say" data-text="${esc(w.nl)}" class="row">
      <span class="w-nl">${wordHTML(w)}</span><span class="w-en">${esc(w.en)}</span>${pips(box(w))}</button></li>`).join('')}</ul>
  <h2 class="h">zinnen</h2>
  <ul class="words sents">${p.sents.map(s => `<li><button data-act="say" data-text="${esc(fill(s.nl))}" class="row">
      <span class="w-nl">${esc(fill(s.nl))}</span><span class="w-en">${esc(fill(s.en))}</span></button></li>`).join('')}</ul>
  ${p.mine ? '<p class="fine pad">These words were added on top of your own list.</p>' : ''}
  ${versionLine()}`;
};
function pips(b) { return `<span class="pips" aria-label="strength ${b} of 5">${[1, 2, 3, 4, 5].map(i => `<i class="${i <= b ? 'on' : ''}"></i>`).join('')}</span>`; }

/* ------------------------------------------------------------------ session */
let ses = null, cur = null;
function qFor(w) {
  const b = box(w);
  if (b <= 1) return { t: 'mc', dir: 'nl-en', w };
  if (b === 2) return { t: 'mc', dir: 'en-nl', w };
  if (b === 4 && voice) return { t: 'listen', w };
  return { t: 'type', w };
}
function pickSentences(places, n, any) {
  const now = Date.now(), sb = x => (S.sents[x.id] || {}).b || 0;
  const ready = x => (count(x.place.items, isMet) >= x.place.items.length * 0.5 ? 0 : 1);
  const pool = SENTS.filter(x => places.includes(x.place)).filter(x => any || !S.sents[x.id] || S.sents[x.id].due <= now);
  return shuffle(pool).sort((a, b) => ready(a) - ready(b) || sb(a) - sb(b) || (any ? 0 : a.place.index - b.place.index)).slice(0, n);
}
function buildWalk(opts = {}) {
  const pool = opts.place ? opts.place.items : WORDS;
  let reviews = shuffle(dueWords(pool).sort((a, b) => S.items[a.id].due - S.items[b.id].due).slice(0, 24));
  const quota = (opts.place || opts.extra) ? 10 : Math.max(0, Math.min(10, S.pace - today().n));
  const flagged = w => ((S.items[w.id] || {}).s ? 0 : 1);   // words the sneltest marked as unknown come first
  const fresh = pool.filter(w => !isMet(w)).sort((a, b) => flagged(a) - flagged(b)).slice(0, quota);
  const steps = [];
  let free = [];
  if (!reviews.length && !fresh.length) {           // nothing due, nothing new: practise the shakiest words for fun
    free = shuffle(pool.filter(isMet)).sort((a, b) => box(a) - box(b)).slice(0, 12);
    free.forEach(w => steps.push(Object.assign(qFor(w), { free: true })));
  }
  reviews.splice(0, 4).forEach(w => steps.push(qFor(w)));
  for (let i = 0; i < fresh.length; i += 3) {
    const g = fresh.slice(i, i + 3);
    g.forEach(w => steps.push({ t: 'intro', w }));
    shuffle(g).forEach(w => steps.push({ t: 'mc', dir: 'nl-en', w }));
    reviews.splice(0, 2).forEach(w => steps.push(qFor(w)));
  }
  reviews.forEach(w => steps.push(qFor(w)));
  shuffle(fresh).forEach(w => steps.push({ t: 'mc', dir: 'en-nl', w }));
  const places = opts.place ? [opts.place] : PLACES;
  pickSentences(places, opts.place ? 3 : 2).forEach(s => steps.push({ t: 'sent', s }));
  return steps;
}
function startSession(steps, meta) {
  if (!steps.length) { toast('Nothing to practise here yet.'); return; }
  ses = Object.assign({ steps, i: 0, ok: 0, bad: 0, w: 0, combo: 0, maxCombo: 0, newN: 0, sents: 0, mode: 'walk', color: 'pink',
    openBefore: PLACES.filter(placeOpen).map(p => p.id), levelBefore: levelIndex() }, meta);
  go('session');
}
VIEWS.session = () => '<div id="ses"></div>';
AFTER.session = () => renderStep();

function chrome(inner, opts = {}) {
  const pct = Math.round(100 * ses.i / ses.steps.length);
  const right = ses.mode === 'boss'
    ? `<div class="lives" aria-label="${ses.lives} lives">${[0, 1, 2].map(i => `<span class="${i < ses.lives ? 'on' : ''}">${icon('wafel')}</span>`).join('')}</div>`
    : `<div class="count wafels" id="sesW">${icon('wafel')}<b>${ses.w}</b></div>`;
  return `<div class="ses ${opts.cls || ''} c-${opts.color || ses.color}">
    <header class="ses-top"><button class="x" data-act="quit" aria-label="stop">${icon('x')}</button>
      <div class="bar"><i style="width:${pct}%"></i></div>${right}</header>
    ${ses.mode === 'boss' ? '<div class="timer"><i id="timerBar"></i></div>' : ''}
    <main class="ses-main">${inner}</main>
    <div class="foot">${opts.foot || `<div class="peek">${ses.combo >= 3 && ses.mode !== 'boss' ? `<b>${ses.combo} op rij</b>` : ''}</div>`}<div class="fb" id="fb" hidden></div></div>
  </div>`;
}
function renderStep() {
  clearTimers();
  const step = ses.steps[ses.i]; cur = { step, done: false };
  ({ intro: renderIntro, mc: renderMC, listen: renderMC, type: renderType, sent: renderSent })[step.t](step);
  window.scrollTo(0, 0);
  if (ses.mode === 'boss') {
    const bar = $('#timerBar'); if (bar) { bar.style.animationDuration = '7s'; bar.classList.add('run'); }
    later(() => { if (!cur.done) resolve(false, 0, { timeout: true }); }, 7000);
  }
}
function hearBtn(text, big) { return voice ? `<button class="hear ${big ? 'big' : ''}" data-act="say" data-text="${esc(text)}" aria-label="listen">${icon('speaker')}</button>` : ''; }

function renderIntro(step) {
  const w = step.w;
  $('#ses').innerHTML = chrome(`
    <div class="intro">
      <span class="tag">nieuw woord</span>
      <h1 class="word ${sizeCls(w.nl)}">${wordHTML(w)}</h1>
      <p class="mean">${esc(w.en)}</p>
      ${hearBtn(w.nl, true)}
    </div>`, { cls: 'is-intro', color: w.place.color, foot: '<div class="pair"><button class="btn btn-clear wide" data-act="knowit">ken ik al<em>I know this one</em></button><button class="btn btn-white wide" data-act="gotit">hebbes<em>got it</em></button></div>' });
  say(w.nl);
}

function confusable(a, b) { return a.bare === b.bare || a.parts.some(x => b.parts.includes(x)); }
function options(w) {
  const ok = x => x !== w && !confusable(w, x);
  let pool = shuffle(w.place.items.filter(ok)).sort((a, b) => (b.kind === w.kind) - (a.kind === w.kind));
  if (pool.length < 3) pool = pool.concat(shuffle(WORDS.filter(x => ok(x) && x.place !== w.place)));
  return shuffle([w, ...pool.slice(0, 3)]);
}
function renderMC(step) {
  const w = step.w, listen = step.t === 'listen', nlFirst = listen || step.dir === 'nl-en';
  cur.opts = options(w);
  const prompt = listen
    ? `<p class="ask">luister <span>listen, then pick</span></p>${hearBtn(w.nl, true)}`
    : nlFirst
      ? `<p class="ask">${ses.mode === 'sort' ? 'ken je dit al? <span>do you know this one</span>' : 'wat betekent <span>what does it mean</span>'}</p><h1 class="word ${sizeCls(w.nl)}">${wordHTML(w)}</h1>${hearBtn(w.nl)}`
      : `<p class="ask">hoe zeg je <span>how do you say</span></p><h1 class="word ${sizeCls(w.en)}">${esc(w.en)}</h1>`;
  $('#ses').innerHTML = chrome(`
    <div class="prompt">${prompt}</div>
    <div class="opts">${cur.opts.map((o, i) => `<button class="opt" data-act="opt" data-i="${i}"><kbd>${i + 1}</kbd><span>${nlFirst ? esc(o.en) : wordHTML(o)}</span></button>`).join('')}</div>`,
    ses.mode === 'sort' ? { foot: '<button class="btn btn-ghost wide" data-act="noidea">geen idee<em>no idea, teach me</em></button>' } : {});
  if (nlFirst) say(w.nl);
}
function onOpt(i) {
  if (cur.done || !cur.opts) return;
  const o = cur.opts[i], w = cur.step.w, right = o === w;
  document.querySelectorAll('.opt').forEach((b, k) => {
    b.disabled = true;
    if (cur.opts[k] === w) b.classList.add('right'); else if (k === i) b.classList.add('wrong');
  });
  resolve(right, 1);
}

function norm(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[?!.,;:'’"…]/g, '').replace(/\s+/g, ' ').trim(); }
function lev(a, b) {
  if (Math.abs(a.length - b.length) > 1) return 9;
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}
function judge(w, input) {
  const a = norm(input), t = norm(w.nl);
  if (!a) return { r: 'empty' };
  if (a === t) return { r: 'ok' };
  if (w.art) {
    const bare = norm(w.bare), other = w.art === 'de' ? 'het' : 'de';
    if (a === bare) return { r: 'ok', note: 'noart' };
    if (a === other + ' ' + bare) return { r: 'ok', note: 'wrongart' };
  }
  const syn = WORDS.find(x => x !== w && (norm(x.nl) === a || norm(x.bare) === a) && x.parts.some(p => w.parts.includes(p)));
  if (syn) return { r: 'syn' };
  if (t.length >= 5 && lev(a, t) === 1) return { r: 'ok', note: 'typo' };
  return { r: 'no' };
}
function renderType(step) {
  const w = step.w;
  $('#ses').innerHTML = chrome(`
    <div class="prompt"><p class="ask">${step.prove ? 'bewijs het <span>prove it: type it in Dutch</span>' : 'typ het in het Nederlands <span>type it in Dutch</span>'}</p>
      <h1 class="word ${sizeCls(w.en)}">${esc(w.en)}</h1></div>
    <form class="typer" data-form="type" autocomplete="off">
      <input id="ans" type="text" lang="nl" inputmode="text" autocapitalize="none" autocorrect="off" autocomplete="off" spellcheck="false" enterkeyhint="done" placeholder="${w.art ? 'de of het …' : '…'}" aria-label="your answer in Dutch">
      <p class="hintline" id="hint">${w.art ? 'nouns want their de or het' : '&nbsp;'}</p>
      <div id="fbslot"></div>
      <div class="typer-btns" id="typerBtns"><button type="button" class="btn btn-ghost" data-act="dunno">geen idee</button><button class="btn btn-pink">controleer</button></div>
    </form>`);
  const inp = $('#ans'); if (inp && matchMedia('(pointer:fine)').matches) inp.focus();
}
function onType() {
  if (cur.done) { next(); return; }
  const w = cur.step.w, inp = $('#ans'), j = judge(w, inp.value);
  if (j.r === 'empty') { inp.classList.remove('shake'); void inp.offsetWidth; inp.classList.add('shake'); return; }
  if (j.r === 'syn') { $('#hint').innerHTML = '<b>ook juist!</b> that works too, but there is another word for it.'; inp.value = ''; inp.focus(); return; }
  inp.readOnly = true; inp.classList.add(j.r === 'ok' ? 'right' : 'wrong');
  resolve(j.r === 'ok', 2, { note: j.note });
}

function sentTokens(text) {
  const proper = new Set(['Nederlands', 'Brussel', 'Aldi', 'Gent', 'Engels', 'Griekse', 'Belgisch', S.name, S.dog].filter(Boolean));
  let start = true; const out = [];
  fill(text).split(/\s+/).forEach(raw => {
    let t = raw.replace(/^["']+|[.,!?;:"']+$/g, '');
    if (!t) return;
    if (start && !proper.has(t)) t = t.charAt(0).toLowerCase() + t.slice(1);
    start = /[.!?]$/.test(raw); out.push(t);
  });
  return out;
}
function renderSent(step) {
  const s = step.s, target = sentTokens(s.nl), low = target.map(t => t.toLowerCase());
  const others = shuffle([...new Set(s.place.sents.filter(x => x !== s).flatMap(x => sentTokens(x.nl)))].filter(t => !low.includes(t.toLowerCase()) && /^[a-zà-ÿ]/.test(t) && t !== S.dog && t !== S.name)).slice(0, 2);
  cur.target = target; cur.picked = [];
  cur.tiles = shuffle(target.concat(others)).map((t, i) => ({ t, i, used: false }));
  $('#ses').innerHTML = chrome(`
    <div class="prompt"><p class="ask">bouw de zin <span>build the sentence</span></p>
      <h1 class="word sm">${esc(fill(s.en))}</h1></div>
    <div class="slots" id="slots" aria-label="your sentence"></div>
    <div class="bank" id="bank"></div>`, { foot: '<button class="btn btn-pink wide" data-act="checksent" id="checkSent" disabled>controleer</button>' });
  drawTiles();
}
function drawTiles() {
  $('#slots').innerHTML = cur.picked.map(i => `<button class="til" data-act="unpick" data-i="${i}">${esc(cur.tiles[i].t)}</button>`).join('') || '<span class="ghost">tap the words in order</span>';
  $('#bank').innerHTML = cur.tiles.map(x => `<button class="til ${x.used ? 'used' : ''}" data-act="pick" data-i="${x.i}" ${x.used ? 'disabled' : ''}>${esc(x.t)}</button>`).join('');
  const b = $('#checkSent'); if (b) b.disabled = cur.picked.length === 0;
}
function onCheckSent() {
  if (cur.done) { next(); return; }
  const got = cur.picked.map(i => cur.tiles[i].t.toLowerCase()).join(' ');
  const right = got === cur.target.map(t => t.toLowerCase()).join(' ');
  $('#slots').classList.add(right ? 'right' : 'wrong');
  document.querySelectorAll('.til').forEach(b => { b.disabled = true; });
  $('#checkSent').hidden = true;
  resolve(right, 3);
}

/* What happens after any answer. */
function resolve(right, pts, info = {}) {
  cur.done = true; clearTimers();
  const step = cur.step, w = step.w, s = step.s;
  const speak = s ? fill(s.nl) : w.nl;
  if (ses.mode === 'boss') {
    if (right) { ses.ok++; sfx.ok(); } else { ses.bad++; ses.lives--; sfx.bad(); buzz(60); document.querySelectorAll('.lives span').forEach((el, i) => el.classList.toggle('on', i < ses.lives)); }
    showFb(right, w, s, info); return;
  }
  const d = today(); d.a++;
  if (ses.mode === 'sort') {                          // the sneltest only sorts: known words jump ahead, the rest wait to be taught
    const r = R(w); r.s = 1; r.t = Date.now();
    if (right) { r.b = 3; r.ok++; r.due = dayStart(Date.now()) + (1 + Math.floor(Math.random() * 3)) * DAY; ses.ok++; ses.w++; S.wafels++; d.c++; d.w++; sfx.ok(); buzz(12); }
    else { ses.bad++; sfx.tap(); }
    save();
    const c0 = $('#sesW b'); if (c0) c0.textContent = ses.w;
    showFb(right, w, null, info, right ? 1 : 0); return;
  }
  if (w && box(w) === 0 && !step.prove) { d.n++; ses.newN++; }   // first real answer on a word = it counts as met today
  if (right) {
    ses.ok++; ses.combo++; ses.maxCombo = Math.max(ses.maxCombo, ses.combo);
    if (ses.combo >= 5) pts += 1;
    ses.w += pts; S.wafels += pts; d.c++; d.w += pts;
    if (w && !step.retry && !step.free && info.note !== 'wrongart') { if (step.prove) R(w).b = Math.max(R(w).b, 2); promote(w); }
    if (s) { const r = S.sents[s.id] || (S.sents[s.id] = { b: 0, due: 0 }); r.b = Math.min(5, r.b + 1); r.t = Date.now(); r.due = dayStart(Date.now()) + GAPS[Math.max(2, r.b)]; S.zinnen++; ses.sents++; }
    sfx.ok(); buzz(12);
  } else {
    ses.bad++; ses.combo = 0;
    if (step.prove && !step.retry) { d.n++; ses.newN++; }
    if (w && !step.retry) demote(w);
    if (s) { const r = S.sents[s.id] || (S.sents[s.id] = { b: 0, due: 0 }); r.b = Math.max(0, r.b - 1); r.t = Date.now(); r.due = Date.now(); }
    ses.steps.splice(Math.min(ses.steps.length, ses.i + 4), 0, Object.assign({}, step, { retry: true }));
    sfx.bad(); buzz(60);
  }
  S.bestCombo = Math.max(S.bestCombo, ses.maxCombo);
  save();
  const c = $('#sesW b'); if (c) { c.textContent = ses.w; if (right) { c.parentNode.classList.remove('bump'); void c.parentNode.offsetWidth; c.parentNode.classList.add('bump'); } }
  showFb(right, w, s, info, pts);
  if (!right || step.dir === 'en-nl' || step.t === 'type' || s) say(speak);
}
function showFb(right, w, s, info, pts) {
  const slot = $('#fbslot'), fb = slot || $('#fb');
  let line = rnd(DOG_LINES[right ? 'ok' : 'bad']);
  if (right && ses.mode !== 'boss' && (ses.combo === 5 || ses.combo === 10 || ses.combo === 20)) line = fillLine(rnd(DOG_LINES.combo), { n: ses.combo });
  if (info.timeout) line = ['Te laat!', 'Too slow!'];
  if (ses.mode === 'sort' && !right) line = ['Die leren we.', "We'll learn that one."];
  if (ses.mode === 'sort' && right) line = rnd([['Ken je al!', 'You know it!'], ['Die heb je.', 'Got that one.'], ['Juist!', 'Correct!']]);
  let detail = '';
  const answer = s ? `<p class="fix">${esc(fill(s.nl))}</p>` : `<p class="fix">${wordHTML(w)} <span>= ${esc(w.en)}</span></p>`;
  if (!right) detail = answer;
  else if (info.note === 'noart') detail = `<p class="fix">with its article: ${wordHTML(w)}</p>`;
  else if (info.note === 'wrongart') { line = ['Bijna!', 'Almost!']; detail = `<p class="fix">right word, other article: ${wordHTML(w)}</p>`; }
  else if (info.note === 'typo') detail = `<p class="fix">mind the spelling: ${wordHTML(w)}</p>`;
  else if (s) detail = answer;
  const slow = !right || detail;
  fb.className = 'fb ' + (right ? 'ok' : 'bad') + (slot ? ' inline' : '');
  fb.hidden = false;
  fb.innerHTML = `<div class="fb-in"><div class="fb-txt"><b>${esc(line[0])}</b><small>${esc(line[1])}${right && pts ? ` · +${pts} ${pts === 1 ? 'wafel' : 'wafels'}` : ''}</small>${detail}</div>
    <button type="button" class="btn btn-white" data-act="next">verder</button></div>`;
  const tb = $('#typerBtns'); if (tb) tb.hidden = true;
  if (!slow) later(next, 800); else if (right) later(next, 2600); else if (ses.mode === 'boss') later(next, 1700); else if (ses.mode === 'sort') later(next, 1500);
}
function next() {
  if (!ses || !cur || !cur.done) return;
  clearTimers(); cur.done = false;
  ses.i++;
  if (ses.mode === 'boss' && ses.lives <= 0) return endBoss(false);
  if (ses.i >= ses.steps.length) return ses.mode === 'boss' ? endBoss(true) : finish();
  renderStep();
}
function onKnowIt() {                               // skip the lessons for this word, but prove it by typing
  if (!cur || cur.step.t !== 'intro') return;
  const w = cur.step.w;
  ses.steps = ses.steps.filter((x, k) => k <= ses.i || x.w !== w);
  ses.steps.splice(ses.i + 1, 0, { t: 'type', w, prove: true });
  sfx.tap(); cur.done = true; next();
}
function onGotIt() {
  if (cur.step.t !== 'intro') return;
  sfx.tap();
  cur.done = true; next();
}

/* -------------------------------------------------------- stickers + finish */
function checkStickers(flags = {}) {
  const met = count(WORDS, isMet), vb = count(WORDS, isByHeart), st = liveStreak();
  const rules = { first: S.walks >= 1, perfect: !!flags.perfect || !!S.stickers.perfect, combo10: S.bestCombo >= 10, streak3: st >= 3, streak7: st >= 7, streak30: st >= 30,
    met50: met >= 50, met150: met >= Math.ceil(TOTAL / 2), met300: met >= TOTAL, vb100: vb >= 100, vb300: vb >= TOTAL, dehet20: S.dehetBest >= 20, zin10: S.zinnen >= 10 };
  const got = [];
  STICKERS.forEach(s => { if (rules[s.id] && !S.stickers[s.id]) { S.stickers[s.id] = dkey(); got.push(s); } });
  return got;
}
function finish() {
  const answered = ses.ok + ses.bad, perfect = ses.mode !== 'sort' && ses.bad === 0 && ses.ok >= 8;
  let bonus = 0;
  if (answered >= 5 && (ses.mode === 'walk' || ses.mode === 'place')) { bonus = perfect ? 10 : 5; S.walks++; }
  S.wafels += bonus; today().w += bonus; ses.w += bonus;
  if (answered >= 3) touchStreak();
  const got = checkStickers({ perfect });
  const opened = PLACES.filter(p => placeOpen(p) && !ses.openBefore.includes(p.id));
  const lvlUp = levelIndex() > ses.levelBefore;
  save(); syncSoon();
  go('summary', { got, opened, lvlUp, bonus, perfect });
}
VIEWS.summary = d => {
  const answered = ses.ok + ses.bad, acc = answered ? Math.round(100 * ses.ok / answered) : 100, lvl = LEVELS[levelIndex()];
  const plan = walkPlan();
  if (ses.mode === 'sort') {
    const left = unsorted().length;
    return `<div class="sum">
      <div class="sum-top c-cyan">${wafelArt()}<h1>gesorteerd!</h1><p>What you knew comes back in a few days as a typing check.</p></div>
      <div class="chips">
        <div class="chip c-green"><b>${ses.ok}</b><span>you know already</span></div>
        <div class="chip c-yellow"><b>${ses.bad}</b><span>to learn</span></div>
        <div class="chip c-pink"><b>${TOTAL - left}</b><span>of ${TOTAL} sorted</span></div>
        <div class="chip c-teal"><b>${count(WORDS, isMet)}</b><span>words known so far</span></div>
      </div>
      ${d.got.map(s => `<div class="news c-${s.color}"><b>sticker: ${esc(s.nl)}</b><span>${esc(s.en)}</span></div>`).join('')}
      <div class="dock stackd">
        ${left ? `<button class="btn btn-pink wide" data-act="sorteer">nog een rondje<em>${left} words left to sort</em></button>` : `<button class="btn btn-pink wide" data-act="walk">start de wandeling<em>everything is sorted, time to learn</em></button>`}
        <button class="btn btn-ghost wide" data-act="go" data-to="home">klaar voor nu</button>
      </div></div>`;
  }
  const head = d.perfect ? 'foutloos!' : acc >= 80 ? 'goed bezig!' : 'allez, het komt.';
  const headEn = d.perfect ? 'not one mistake' : acc >= 80 ? 'nice going' : "come on, it's coming";
  return `<div class="sum">
    <div class="sum-top c-${d.perfect ? 'green' : 'yellow'}">${wafelArt()}<h1>${head}</h1><p>${headEn}, ${esc(S.name)}</p></div>
    <div class="chips">
      <div class="chip c-pink"><b>+${ses.w}</b><span>wafels${d.bonus ? ` (${d.bonus} bonus)` : ''}</span></div>
      <div class="chip c-teal"><b>${acc}%</b><span>${ses.ok} of ${answered} right</span></div>
      ${ses.newN ? `<div class="chip c-yellow"><b>${ses.newN}</b><span>new words met</span></div>` : ''}
      <div class="chip c-orange"><b>${liveStreak()}</b><span>${liveStreak() === 1 ? 'day' : 'days'} in a row</span></div>
    </div>
    ${d.lvlUp ? `<div class="news c-cyan"><b>nieuw niveau: ${lvl.nl}</b><span>new level: ${lvl.en}</span></div>` : ''}
    ${d.got.map(s => `<div class="news c-${s.color}"><b>sticker: ${esc(s.nl)}</b><span>${esc(s.en)}</span></div>`).join('')}
    <div class="dock stackd">
      <button class="btn btn-pink wide" data-act="${plan.due + plan.fresh > 0 ? 'walk' : 'extra'}">nog een rondje<em>${plan.due + plan.fresh > 0 ? `${Math.min(plan.due, 24) + plan.fresh} words ready` : 'ahead of schedule: 10 extra'}</em></button>
      <button class="btn btn-ghost wide" data-act="go" data-to="home">klaar voor nu</button>
    </div>
  </div>`;
};
AFTER.summary = d => { sfx.win(); if (d.got.length || d.lvlUp || d.opened.length || d.perfect) confetti(); };

/* --------------------------------------------------------------------- boss */
VIEWS.bossintro = id => {
  const p = PLACES.find(x => x.id === id);
  return `<div class="boss c-${p.color}">
    <button class="x" data-act="place" data-id="${p.id}" aria-label="back">${icon('back')}</button>
    <div class="boss-mid"><span class="tag">de baas van ${esc(p.nl)}</span>
      <h1>${esc(p.boss.who)}</h1>
      <p class="quote">“${esc(fill(p.boss.line))}”</p><p class="quote-en">${esc(fill(p.boss.lineEn))}</p>
      <p class="rules">12 questions. 7 seconds each. 3 wafels to lose.</p></div>
    <div class="dock"><button class="btn btn-white wide" data-act="bossgo" data-id="${p.id}">allez, kom maar<em>bring it on</em></button></div>
  </div>`;
};
function startBoss(id) {
  const p = PLACES.find(x => x.id === id);
  const steps = shuffle(p.items).slice(0, 12).map((w, i) => ({ t: voice && i % 4 === 3 ? 'listen' : 'mc', dir: i % 2 ? 'en-nl' : 'nl-en', w }));
  startSession(steps, { mode: 'boss', lives: 3, place: p, color: p.color });
}
function endBoss(won) {
  const p = ses.place; let fresh = false;
  if (won) { fresh = !S.stickers['boss:' + p.id]; S.stickers['boss:' + p.id] = S.stickers['boss:' + p.id] || dkey(); S.wafels += 15; today().w += 15; }
  touchStreak(); save(); syncSoon();
  go('bossend', { won, fresh, id: p.id });
}
VIEWS.bossend = d => {
  const p = PLACES.find(x => x.id === d.id);
  return `<div class="boss c-${d.won ? 'green' : 'orange'}">
    <div class="boss-mid">${d.won ? wafelArt() : ''}
      <h1>${d.won ? 'gewonnen!' : 'oei.'}</h1>
      <p class="quote">${d.won ? `${esc(p.boss.who)} is onder de indruk.` : `${esc(p.boss.who)} wint deze keer.`}</p>
      <p class="quote-en">${d.won ? `${esc(p.boss.who)} is impressed. +15 wafels${d.fresh ? ' and a new sticker' : ''}.` : `${esc(p.boss.who)} wins this time. ${ses.ok} of 12 right.`}</p></div>
    <div class="dock stackd">
      ${d.won ? '' : `<button class="btn btn-white wide" data-act="bossgo" data-id="${p.id}">nog eens<em>again</em></button>`}
      <button class="btn ${d.won ? 'btn-white' : 'btn-clear'} wide" data-act="place" data-id="${p.id}">terug naar ${esc(p.nl)}</button>
    </div></div>`;
};
AFTER.bossend = d => { if (d.won) { sfx.win(); confetti(); } };

/* --------------------------------------------------------------- de of het? */
let dh = null;
function startDeHet() {
  const open = WORDS.filter(w => w.art && !w.plural && placeOpen(w.place));
  const met = open.filter(isMet);
  const all = WORDS.filter(w => w.art && !w.plural);
  dh = { pool: shuffle(met.length >= 10 ? met : open.length >= 10 ? open : all), i: 0, score: 0, miss: 0, end: Date.now() + 45000, lock: false };
  go('dehet');
}
VIEWS.dehet = () => `<div class="dh">
  <header class="ses-top"><button class="x" data-act="go" data-to="home" aria-label="stop">${icon('x')}</button>
    <div class="bar"><i id="dhBar" style="width:100%"></i></div><div class="count" id="dhScore"><b>0</b></div></header>
  <main class="dh-main"><p class="ask">de of het?</p><h1 class="word" id="dhWord"></h1><p class="mean" id="dhEn"></p></main>
  <div class="dh-btns"><button class="dhb de" data-act="dh" data-a="de">de</button><button class="dhb het" data-act="dh" data-a="het">het</button></div>
</div>`;
AFTER.dehet = () => {
  drawDh();
  ticker = setInterval(() => {
    const left = dh.end - Date.now(), bar = $('#dhBar');
    if (bar) bar.style.width = Math.max(0, 100 * left / 45000) + '%';
    if (left <= 0) endDeHet();
  }, 100);
};
function drawDh() {
  const w = dh.pool[dh.i % dh.pool.length];
  const el = $('#dhWord'); el.className = 'word ' + sizeCls(w.bare); el.textContent = w.bare; $('#dhEn').textContent = w.en;
}
function onDh(a) {
  if (dh.lock) return;
  const w = dh.pool[dh.i % dh.pool.length], right = a === w.art, el = $('#dhWord');
  dh.lock = true;
  if (right) { dh.score++; sfx.ok(); buzz(10); $('#dhScore b').textContent = dh.score; }
  else { dh.miss++; sfx.bad(); buzz(60); }
  el.innerHTML = wordHTML(w); el.classList.add(right ? 'flash-ok' : 'flash-bad');
  setTimeout(() => { if (view.name !== 'dehet') return; dh.lock = false; dh.i++; drawDh(); }, right ? 320 : 1100);
}
function endDeHet() {
  clearTimers();
  const earned = Math.floor(dh.score / 2), record = dh.score > S.dehetBest;
  S.dehetBest = Math.max(S.dehetBest, dh.score); S.wafels += earned; today().w += earned; today().a += dh.score + dh.miss; today().c += dh.score;
  if (dh.score + dh.miss >= 5) touchStreak();
  const got = checkStickers(); save(); syncSoon();
  go('dhend', { earned, record, got });
}
VIEWS.dhend = d => `<div class="boss c-teal">
  <div class="boss-mid"><h1>${dh.score}</h1>
    <p class="quote">${d.record ? 'nieuw record!' : 'juiste lidwoorden'}</p>
    <p class="quote-en">${d.record ? 'a new record' : 'articles right'}. ${dh.miss} missed. +${d.earned} wafels. best: ${S.dehetBest}.</p>
    ${d.got.map(s => `<div class="news c-yellow"><b>sticker: ${esc(s.nl)}</b><span>${esc(s.en)}</span></div>`).join('')}</div>
  <div class="dock stackd"><button class="btn btn-white wide" data-act="dehet">nog eens<em>again</em></button>
    <button class="btn btn-clear wide" data-act="go" data-to="home">klaar</button></div></div>`;
AFTER.dhend = d => { if (d.record || d.got.length) { sfx.win(); confetti(); } };

/* ----------------------------------------------------------------- progress */
VIEWS.progress = () => {
  const met = count(WORDS, isMet), known = count(WORDS, isKnown), vb = count(WORDS, isByHeart), unmet = TOTAL - met;
  const days = [...Array(14)].map((_, i) => { const d = new Date(Date.now() - (13 - i) * DAY); return { d, k: dkey(d), v: (S.days[dkey(d)] || {}).a || 0 }; });
  const max = Math.max(20, ...days.map(x => x.v));
  const all = Object.values(S.days).reduce((t, d) => ({ a: t.a + d.a, c: t.c + d.c }), { a: 0, c: 0 });
  const acc = all.a ? Math.round(100 * all.c / all.a) : 0;
  const eta = new Date(Date.now() + Math.ceil(unmet / S.pace) * DAY);
  const hard = WORDS.filter(w => (S.items[w.id] || {}).bad >= 2).sort((a, b) => S.items[b.id].bad - S.items[a.id].bad).slice(0, 8);
  const wd = ['z', 'm', 'd', 'w', 'd', 'v', 'z'];
  return `
  <header class="top"><div class="brand">vooruitgang</div><div class="counters"><span class="count">${icon('flame')}<b>${liveStreak()}</b></span></div></header>
  <section class="big3">
    <div class="b3 c-yellow"><b>${met}</b><span>ontmoet</span><small>met at least once</small></div>
    <div class="b3 c-teal"><b>${known}</b><span>gekend</span><small>right 3 times running</small></div>
    <div class="b3 c-pink"><b>${vb}</b><span>van buiten</span><small>by heart</small></div>
  </section>
  <p class="lede">${unmet > 0 ? `${unmet} words still to meet. At ${S.pace} a day you have met all ${TOTAL} by <b>${eta.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}</b>.` : `You have met all ${TOTAL}. Now it is repetition until they stick: amai.`}</p>
  <h2 class="h">laatste 14 dagen</h2>
  <div class="days" role="img" aria-label="answers per day, last 14 days">${days.map(x => `<div class="day ${x.k === dkey() ? 'now' : ''}"><span class="v">${x.v || ''}</span><i style="height:${Math.max(x.v ? 6 : 2, Math.round(100 * x.v / max))}%"></i><span class="l">${wd[x.d.getDay()]}</span></div>`).join('')}</div>
  <p class="fine pad">${all.a} answers so far, ${acc}% right. Best streak: ${S.streak.best} ${S.streak.best === 1 ? 'day' : 'days'}. Best run: ${S.bestCombo} in a row.</p>
  <h2 class="h">per plek</h2>
  <ul class="perplace">${PLACES.map(p => { const m = count(p.items, isMet), v = count(p.items, isByHeart), t = p.items.length;
    return `<li><span class="sq c-${p.color}"></span><span class="pp-n">${esc(p.nl)}</span><span class="pp-bar"><i class="c-${p.color}" style="width:${100 * m / t}%"></i><u style="width:${100 * v / t}%"></u></span><span class="pp-c">${m}/${t}</span></li>`; }).join('')}</ul>
  <p class="fine pad">Colour is met, the black line is by heart.</p>
  <h2 class="h">lastige woorden</h2>
  ${hard.length ? `<ul class="words">${hard.map(w => `<li><button data-act="say" data-text="${esc(w.nl)}" class="row"><span class="w-nl">${wordHTML(w)}</span><span class="w-en">${esc(w.en)}</span><span class="miss">${S.items[w.id].bad}× wrong</span></button></li>`).join('')}</ul>` : '<p class="fine pad">No tricky words yet. They show up here once you miss one twice.</p>'}
  ${versionLine()}`;
};

/* ----------------------------------------------------------------- stickers */
VIEWS.stickers = () => {
  const all = STICKERS.concat(PLACES.map(p => ({ id: 'boss:' + p.id, nl: p.boss.who.replace(/ van .*/, ''), en: `beat the boss of ${p.nl}`, icon: p.icon, color: p.color })));
  const have = all.filter(s => S.stickers[s.id]).length;
  return `
  <header class="top"><div class="brand">stickers</div><div class="counters"><span class="count wafels">${icon('wafel')}<b>${S.wafels}</b></span></div></header>
  <p class="lede">${have} of ${all.length} collected. Level: <b>${LEVELS[levelIndex()].nl}</b>.</p>
  <ul class="stick">${all.map(s => { const on = !!S.stickers[s.id];
    return `<li class="${on ? 'on' : ''}"><span class="disc ${on ? 'c-' + s.color : ''}">${icon(on ? s.icon : 'lock')}</span><b>${esc(s.nl)}</b><small>${esc(s.en)}</small></li>`; }).join('')}</ul>
  <h2 class="h">niveaus</h2>
  <ol class="levels">${LEVELS.map((l, i) => `<li class="${i <= levelIndex() ? 'on' : ''}"><span class="lv-at">${l.at}</span><b>${l.nl}</b><small>${l.en}</small></li>`).join('')}</ol>
  ${versionLine()}`;
};

/* ----------------------------------------------------------------- settings */
VIEWS.settings = () => `
  <header class="top"><div class="brand">instellingen</div></header>
  <form class="set" data-form="settings">
    <label>your name<input name="name" value="${esc(S.name)}" maxlength="20" autocomplete="off"></label>
    <label>your dog's name <small>optional: she then shows up by name in two sentences</small><input name="dog" value="${esc(S.dog)}" maxlength="20" autocomplete="off"></label>
    <fieldset><legend>new words a day</legend><div class="seg">${[[10, 'rustig'], [20, 'stevig'], [30, 'turbo']].map(([n, l]) => `<label><input type="radio" name="pace" value="${n}" ${S.pace === n ? 'checked' : ''}><span><b>${n}</b>${l}</span></label>`).join('')}</div></fieldset>
    <label class="tog"><input type="checkbox" name="sound" ${S.sound ? 'checked' : ''}><span>sounds and buzz</span></label>
    <label class="tog"><input type="checkbox" name="voice" ${S.voice ? 'checked' : ''}><span>say words out loud ${voice ? `(${esc(voice.name)}, ${esc(voice.lang)})` : '(no Dutch voice on this device)'}</span></label>
  </form>
  ${SYNC_READY || S.sync ? syncBlock() : ''}
  <h2 class="h">een kopie bewaren</h2>
  <p class="fine pad">${S.sync ? 'Sync already keeps a copy in your Google Sheet. A backup file is an extra one you hold yourself.' : 'Progress lives in this browser on this device. Save a backup file now and then.'}</p>
  <div class="actions">
    <button class="btn btn-ghost" data-act="export">download a backup</button>
    <button class="btn btn-ghost" data-act="import">restore from a backup</button>
    <input type="file" id="importFile" accept="application/json,.json" hidden>
    <button class="btn btn-clear danger" data-act="reset">start over from zero</button>
  </div>
  ${versionLine()}`;

/* --------------------------------------------------------------- onboarding */
VIEWS.hello = () => `<div class="hello">
  <div class="hello-top c-yellow">${wafelArt()}<h1>hallo!</h1><p>${TOTAL} Flemish Dutch words and ${SENTS.length} sentences, one wafel at a time. Know some already? Start with the sneltest.</p></div>
  <form class="set" data-form="hello">
    <label>hoe heet jij? <small>what's your name?</small><input name="name" value="${esc(S.name)}" maxlength="20" autocomplete="off" required></label>
    <fieldset><legend>hoe snel? <small>new words a day</small></legend><div class="seg">${[[10, 'rustig'], [20, 'stevig'], [30, 'turbo']].map(n => [n[0], n[1], Math.ceil(TOTAL / n[0]) + ' days']).map(([n, l, d]) => `<label><input type="radio" name="pace" value="${n}" ${S.pace === n ? 'checked' : ''}><span><b>${n}</b>${l}<i>${d}</i></span></label>`).join('')}</div></fieldset>
    <button class="btn btn-pink wide">allez, we gaan<em>come on, let's go</em></button>
  </form>
  ${versionLine()}</div>`;

/* ------------------------------------------------------------------ actions */
function toast(msg) {
  let t = $('#toast'); if (!t) { t = document.createElement('div'); t.id = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('on'), 2600);
}
const ACT = {
  go: d => go(d.to),
  walk: () => startSession(buildWalk(), { mode: 'walk' }),
  extra: () => startSession(buildWalk({ extra: true }), { mode: 'walk' }),
  practise: d => { const p = PLACES.find(x => x.id === d.id); startSession(buildWalk({ place: p }), { mode: 'place', place: p, color: p.color }); },
  zinnen: () => startSession(pickSentences(PLACES, 6, true).map(x => ({ t: 'sent', s: x })), { mode: 'zinnen', color: 'yellow' }),
  sorteer: () => startSession(unsorted().slice(0, 30).map(w => ({ t: 'mc', dir: 'nl-en', w })), { mode: 'sort', color: 'cyan' }),
  noidea: () => { if (cur && !cur.done && ses.mode === 'sort') { document.querySelectorAll('.opt').forEach((b, k) => { b.disabled = true; if (cur.opts[k] === cur.step.w) b.classList.add('right'); }); resolve(false, 0, { noidea: true }); } },
  knowit: () => onKnowIt(),
  dehet: () => startDeHet(),
  dh: d => onDh(d.a),
  place: d => go('place', d.id),
  boss: d => go('bossintro', d.id),
  bossgo: d => startBoss(d.id),
  say: d => { say(d.text, true); if (!voice) toast('No Dutch voice on this device.'); },
  opt: d => onOpt(+d.i),
  next: () => next(),
  gotit: () => onGotIt(),
  dunno: () => { if (!cur.done) { $('#ans').readOnly = true; $('#ans').classList.add('wrong'); resolve(false, 0); } },
  pick: d => { const x = cur.tiles[+d.i]; if (cur.done || x.used) return; x.used = true; cur.picked.push(x.i); sfx.tap(); drawTiles(); },
  unpick: d => { if (cur.done) return; const i = +d.i; cur.tiles[i].used = false; cur.picked = cur.picked.filter(k => k !== i); drawTiles(); },
  checksent: () => onCheckSent(),
  quit: () => { const b = ses && ses.mode === 'boss'; if (ses && ses.mode !== 'boss' && ses.ok + ses.bad >= 3) { touchStreak(); checkStickers(); save(); syncSoon(); } b ? go('place', ses.place.id) : go('home'); },
  syncnow: () => { syncNow().then(ok => toast(ok ? 'Synced.' : syncErr ? 'Sync did not work: ' + syncErr : 'Already syncing.')); },
  synccode: () => {
    const code = S.sync.id + '~' + S.sync.key;
    const ok = () => toast('Sync code copied. Paste it under instellingen on your other device.');
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(code).then(ok, () => prompt('Copy this sync code:', code)); else prompt('Copy this sync code:', code);
  },
  unlink: () => { if (confirm('Unlink this device? Your progress stays here and in your Google Sheet, it just stops syncing from this device.')) { delete S.sync; syncErr = ''; save(); go('settings'); } },
  export: () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(stripSync(S), null, 1)], { type: 'application/json' }));
    a.download = `goed-bezig-backup-${dkey()}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  },
  import: () => $('#importFile').click(),
  reset: () => {
    if (!confirm('Start over from zero? This wipes every word, wafel and sticker on this device' + (S.sync ? ', and at the next sync on your other devices and in your Google Sheet too.' : '.'))) return;
    const sync = S.sync; S = fresh(); S.epoch = Date.now();
    if (sync) S.sync = Object.assign({}, sync, { base: {} });
    save(); go('hello'); syncSoon();
  }
};
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if (!el || el.disabled) return;
  const fn = ACT[el.dataset.act]; if (fn) fn(el.dataset, el);
});
document.addEventListener('submit', e => {
  const f = e.target.closest('[data-form]'); if (!f) return; e.preventDefault();
  if (f.dataset.form === 'type') onType();
  if (f.dataset.form === 'hello') {
    const fd = new FormData(f);
    S.name = (fd.get('name') || '').trim() || 'Anna'; S.pace = +fd.get('pace') || 20;
    S.onboarded = true; S.setT = Date.now(); save(); sfx.win(); go('home'); syncSoon();
  }
  if (f.dataset.form === 'link') {
    const c = parseCode(new FormData(f).get('code') || '');
    if (!c) { toast('That does not look like a sync code.'); return; }
    linkDevice(c); go('settings');
    syncNow().then(ok => toast(ok ? 'Linked and synced.' : 'Linked, but the first sync did not work: ' + syncErr));
  }
});
document.addEventListener('change', e => {
  const f = e.target.closest('[data-form="settings"]');
  if (f) {
    const fd = new FormData(f);
    S.name = (fd.get('name') || '').trim() || 'Anna'; S.dog = (fd.get('dog') || '').trim(); S.pace = +fd.get('pace') || 20;
    S.sound = !!fd.get('sound'); S.voice = !!fd.get('voice'); S.setT = Date.now(); save(); toast('Saved.'); syncSoon();
  }
  if (e.target.id === 'importFile' && e.target.files[0]) {
    const r = new FileReader();
    r.onload = () => {
      try { const d = JSON.parse(r.result); if (!d || typeof d.items !== 'object' || typeof d.wafels !== 'number') throw new Error('shape'); const sync = S.sync; S = Object.assign(fresh(), d, { epoch: Date.now() }); delete S.sync; if (sync) S.sync = Object.assign({}, sync, { base: {} }); save(); toast('Backup restored.'); go('home'); syncSoon(); }
      catch (err) { toast('That file is not a goed bezig backup.'); }
    };
    r.readAsText(e.target.files[0]);
  }
});
document.addEventListener('keydown', e => {
  if (view.name !== 'session' || !cur) return;
  if (e.key === 'Enter' && cur.done && e.target.tagName !== 'INPUT') { e.preventDefault(); next(); return; }
  if (e.key === 'Enter' && cur.step.t === 'intro') { e.preventDefault(); onGotIt(); return; }
  if (cur.opts && !cur.done && /^[1-4]$/.test(e.key)) onOpt(+e.key - 1);
});

/* --------------------------------------------------------------------- boot */
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
(function linkFromAddress() {                       // a link ending in #sync=<code> links this device, then the code leaves the address bar
  const m = location.hash.match(/^#sync=(.+)$/); if (!m) return;
  history.replaceState(null, '', location.pathname + location.search);
  const c = parseCode(decodeURIComponent(m[1]));
  if (!c || (S.sync && S.sync.id === c.id && S.sync.key === c.key)) return;
  if (confirm('Link this device to your goed bezig sync? What you played here and what is in your Google Sheet get combined.')) linkDevice(c);
})();
go(S.onboarded ? 'home' : 'hello');
paintSync();
if (S.sync) syncNow();
document.addEventListener('visibilitychange', () => { if (!document.hidden && S.sync && Date.now() - (S.sync.at || 0) > 60000) syncNow(); });
window.addEventListener('online', () => { if (S.sync && syncErr) syncNow(); });
