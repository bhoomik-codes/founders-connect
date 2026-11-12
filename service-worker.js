const CACHE_NAME = 'founders-connect-shell-v2';
const SHELL_ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './js/app.js',
  './js/founders-data.js',
  './manifest.webmanifest',
  './data/images/founders-connect-icon.svg',
  './data/images/manan-issar.jpg',
  './data/images/ankit-dhir.jpg',
  './data/images/abhishek-soni.webp',
  './data/images/yash-khandelwal.webp',
  './data/images/manoj-adwani.webp',
  './data/images/megha-verma.webp',
  './data/images/koumal-kalantry.webp',
  './data/images/nand-kishore-chaudhary.webp',
  './data/images/harsha-bhurani.webp',
  './data/images/yash-deotwal.webp',
  './data/images/sumit-srivastawa.webp',
  './data/images/shipra-bhutani.webp',
  './data/images/ashish-chhanwal.webp',
  './data/images/karmesh-gupta.webp',
  './data/images/shilpi-dua.webp',
  './data/images/rituraj-sharma.webp',
  './data/images/neha-katta.webp',
  './data/images/rajendra-lora.webp',
  './data/images/astha-katta-sirohiya.webp',
  './data/images/vinod-kulhari.webp',
  './data/images/chetan-saini.webp',
  './data/images/malav-warke.webp'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    const requests = SHELL_ASSETS.map(path => new Request(new URL(path, self.registration.scope), { cache: 'reload' }));
    await cache.addAll(requests);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith('founders-connect-') && name !== CACHE_NAME).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedPage = (await cache.match(request)) || (await cache.match(new URL('./index.html', self.registration.scope)));
      if (cachedPage) return cachedPage;

      try {
        const response = await fetch(request);
        if (response.ok) await cache.put(new URL('./index.html', self.registration.scope), response.clone());
        return response;
      } catch {
        return new Response('You are offline. Open Founders Connect again once to cache the directory.', {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;

    try {
      const response = await fetch(request);
      if (response.ok) await cache.put(request, response.clone());
      return response;
    } catch {
      return new Response('', { status: 503, statusText: 'Offline resource unavailable' });
    }
  })());
});
