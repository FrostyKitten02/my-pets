const CACHE_NAME = 'pet-pwa-cache-v2';
const CACHE_FILES = [
    // '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/service-worker.js',
    '/manifest.json',
    '/icon.png',
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Caching essential files...');
            return cache.addAll(CACHE_FILES).catch(error => {
                console.error('Failed to cache files during install', error);
                throw error; // Rethrow to prevent further installation
            });
        })
    );
});

// Activate Event: Clean up old caches if needed
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME]; // Add new cache name for future versions
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    //caching get requests on pets
    if (event.request.url.includes('/pets') && event.request.method === "GET") {
        event.respondWith(
            caches.open(CACHE_NAME).then(cache => {
                return cache.match(event.request).then(cachedResponse => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    return fetch(event.request).then(response => {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, responseClone);
                        });
                        return response;
                    });
                })
            })
        );
    }
});