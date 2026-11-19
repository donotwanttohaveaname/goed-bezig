/* goed bezig: offline support. Network first, so a new version always wins;
   the cache is only the fallback for the tram tunnel. Bump CACHE with the version. */
const CACHE = 'goed-bezig-1.0.0';
const FILES = ['./', 'index.html', 'css/style.css?v=1.0.0', 'js/data.js?v=1.0.0', 'js/app.js?v=1.0.0', 'manifest.json', 'img/icon-192.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {}); return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: false }).then(m => m || caches.match('index.html'))));
});
