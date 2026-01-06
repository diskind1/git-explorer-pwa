// Bump the cache version. Changing this value forces the browser to re-fetch
// updated assets and avoids stale cached pages after deployments.
const CACHE_NAME = 'git-explorer-cache-v2';
const PRECACHE_URLS = [
  '/',
  'index.html',
  // Precache translated language pages so they are available offline and updates
  // to these pages are picked up when the service worker version changes.
  'index_en.html',
  'index_ru.html',
  'index_fr.html',
  'manifest.json',
  'icons/icon-192.png',
  'icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (!cacheWhitelist.includes(key)) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
