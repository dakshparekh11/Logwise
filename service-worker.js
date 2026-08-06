/* ================================================================
   MEMORA — Service Worker v1.2
   Scope-aware: works at root (/) or subdirectory (/memora/)
   Cache-First for app shell · Network-only for Firebase
   ================================================================ */

const CACHE_NAME = 'memora-v1.2';

// Detect base path automatically — works for both
//   https://username.github.io/memora/   (GitHub Pages)
//   https://your-project.web.app/        (any root hosting)
const BASE = self.registration.scope; // e.g. "https://user.github.io/memora/"

const PRECACHE = [
  BASE,
  BASE + 'index.html',
  BASE + 'manifest.json',
  BASE + 'config.js',
  // CDN assets
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
  'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css',
  'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js',
  'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js',
];

// ── INSTALL ────────────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache =>
        Promise.allSettled(
          PRECACHE.map(url =>
            cache.add(url).catch(err =>
              console.warn('[SW] Could not precache:', url, err)
            )
          )
        )
      )
      .then(() => self.skipWaiting())
  );
});

// ── ACTIVATE ───────────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(names =>
        Promise.all(
          names
            .filter(name => name !== CACHE_NAME)
            .map(name => {
              console.log('[SW] Removing old cache:', name);
              return caches.delete(name);
            })
        )
      )
      .then(() => self.clients.claim())
  );
});

// ── FETCH ──────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // Firebase / Google APIs — always go to network, never cache
  const networkOnly = [
    'firebaseio.com',
    'firestore.googleapis.com',
    'identitytoolkit.googleapis.com',
    'securetoken.googleapis.com',
    'googleapis.com',
  ];
  if (networkOnly.some(h => url.hostname.includes(h))) return;

  // Firebase JS SDKs (gstatic) and CDN assets — Cache-First
  const cdnHosts = [
    'gstatic.com',
    'jsdelivr.net',
    'fonts.googleapis.com',
    'fonts.gstatic.com',
  ];
  if (cdnHosts.some(h => url.hostname.includes(h))) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          if (response && response.ok) {
            caches.open(CACHE_NAME)
              .then(c => c.put(request, response.clone()));
          }
          return response;
        }).catch(() => cached);
      })
    );
    return;
  }

  // App shell (same origin, under our scope) — Stale-While-Revalidate
  if (request.url.startsWith(BASE)) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(request).then(cached => {
          const networkFetch = fetch(request)
            .then(response => {
              if (response && response.ok) {
                cache.put(request, response.clone());
              }
              return response;
            })
            .catch(() => {
              // Offline: serve index.html for any navigation request
              if (request.mode === 'navigate') {
                return cache.match(BASE + 'index.html')
                  || cache.match(BASE);
              }
              return cached;
            });
          // Return cached version immediately; update in background
          return cached || networkFetch;
        })
      )
    );
  }
});

// ── PUSH NOTIFICATIONS ─────────────────────────────────────────
self.addEventListener('push', event => {
  if (!event.data) return;
  let payload;
  try { payload = event.data.json(); }
  catch { payload = { title: 'Memora', body: event.data.text() }; }

  event.waitUntil(
    self.registration.showNotification(payload.title || 'Memora', {
      body: payload.body || 'Time to review your cards!',
      icon: BASE + 'icon-192.png',
      badge: BASE + 'icon-192.png',
      tag: 'memora-reminder',
      renotify: true,
    })
  );
});

// ── NOTIFICATION CLICK ─────────────────────────────────────────
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(list => {
        for (const client of list) {
          if ('focus' in client) return client.focus();
        }
        if (clients.openWindow) return clients.openWindow(BASE);
      })
  );
});

// ── MESSAGES ───────────────────────────────────────────────────
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
