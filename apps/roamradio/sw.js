/* RoamRadio offline shell.

   The previous version was cache-first with no revalidation (`cached || fetch`) and a
   hardcoded cache name. Because sw.js itself never changed between deploys, the browser
   never installed a new worker, so a returning visitor stayed pinned to whatever build
   they first loaded. Shipped fixes never reached them.

   Now: the HTML shell is network-first, so a new deploy is picked up on the next online
   visit and falls back to cache when offline. The gzipped payload chunks and static
   assets stay cache-first, because they are large and only change with a rebuild, which
   also bumps CACHE below. */
const CACHE = 'roamradio-shell-v3';
const SHELL = ['./', './index.html', './manifest.webmanifest', './assets/icon.svg',
  '_payload/10.txt', '_payload/11.txt', '_payload/12.txt', '_payload/13.txt', '_payload/14.txt',
  '_payload/15.txt', '_payload/16.txt', '_payload/17.txt', '_payload/18.txt', '_payload/19.txt'];

self.addEventListener('install', e => e.waitUntil(
  caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
));

self.addEventListener('activate', e => e.waitUntil(
  caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim())
));

function isShellDocument(request, url) {
  return request.mode === 'navigate' ||
    url.pathname.endsWith('/') ||
    url.pathname.endsWith('index.html');
}

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;

  if (isShellDocument(e.request, url)) {
    /* Network first: a fresh deploy wins, the cache is only the offline fallback. */
    e.respondWith(
      fetch(e.request)
        .then(r => {
          const copy = r.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
          return r;
        })
        .catch(() => caches.match(e.request).then(c => c || caches.match('./index.html')))
    );
    return;
  }

  /* Everything else stays cache-first: payload chunks and assets are big and stable. */
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(r => {
      const copy = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return r;
    }).catch(() => caches.match('./index.html')))
  );
});
