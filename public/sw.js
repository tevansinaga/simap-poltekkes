const CACHE_NAME = 'simap-poltekkes-v3';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch handler sengaja tidak melakukan caching halaman dinamis/login.
// Handler ini juga membuat service worker memenuhi pola PWA lama yang
// memerlukan adanya fetch handler untuk mendeteksi kemampuan offline.
self.addEventListener('fetch', (event) => {
    const request = event.request;

    if (request.method !== 'GET') {
        return;
    }

    const url = new URL(request.url);

    if (url.origin !== self.location.origin) {
        return;
    }

    event.respondWith(
        fetch(request).catch(() => {
            return caches.match(request).then((cached) => {
                return cached || Response.error();
            });
        })
    );
});
