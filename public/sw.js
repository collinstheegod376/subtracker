self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  // Simple pass-through or basic caching logic
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
