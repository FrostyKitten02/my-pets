const CACHE_NAME = 'pet-pwa-cache-v2';
const CACHE_FILES = [
    '/',
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

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SYNC_REQUEST') {
        syncPendingRequests();
    }
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
                    if (cachedResponse && !self.navigator.onLine) {
                        return cachedResponse;
                    }

                    return fetch(event.request).then(response => {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            return cache.put(event.request, responseClone);
                        });
                        return response;
                    });
                })
            })
        );
        return;
    }

    if (
        event.request.url.includes('/pets') &&
        ['POST', 'PUT', 'DELETE'].includes(event.request.method)
    ) {
        if (!self.navigator.onLine) {
            event.respondWith(
                (async () => {
                    const clonedRequest = await serializeRequest(event.request);
                    savePendingRequest(clonedRequest);
                    return new Response(JSON.stringify({
                        success: true,
                        message: 'Request stored for sync when online.'
                    }), {
                        status: 202,
                        headers: { 'Content-Type': 'application/json' }
                    });
                })()
            );
            return;
        }
    }

    if (event.request.method === "GET") {
        event.respondWith(
            caches.open(CACHE_NAME).then(cache => {
                return cache.match(event.request).then(cachedResponse => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    // If no cached response, fetch from network
                    return fetch(event.request).then(response => {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            return cache.put(event.request, responseClone);
                        });
                        return response;
                    });
                });
            })
        );
        return;
    }

});

async function serializeRequest(request) {
    const body = await request.clone().text();
    return {
        url: request.url,
        method: request.method,
        headers: Array.from(request.headers.entries()),
        body
    };
}

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('pendingRequestsDB', 1);

        request.onupgradeneeded = () => {
            const db = request.result;
            const store = db.createObjectStore('requests', { keyPath: 'id', autoIncrement: true });
            store.createIndex('url', 'url');
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = reject;
    });
}

async function savePendingRequest(requestData) {
    const db = await openDB();
    const transaction = db.transaction(['requests'], 'readwrite');
    const store = transaction.objectStore('requests');
    store.add(requestData);
    transaction.oncomplete = () => console.log('Request stored in IndexedDB');
    transaction.onerror = () => console.error('Error saving request in IndexedDB');
}

function getAllRequestsFromStore(store) {
    return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function syncPendingRequests() {
    console.log('Device is back online, syncing pending requests...');
    const db = await openDB();
    const transaction = db.transaction(['requests'], 'readonly');
    const store = transaction.objectStore('requests');
    const allRequests = await getAllRequestsFromStore(store)

    for (const requestData of allRequests) {
        const request = new Request(requestData.url, {
            method: requestData.method,
            headers: new Headers(requestData.headers),
            body: requestData.body
        });

        try {
            const response = await fetch(request);
            if (response.ok) {
                console.log('Request synced successfully:', requestData);
                const deleteTransaction = db.transaction(['requests'], 'readwrite');
                const deleteStore = deleteTransaction.objectStore('requests');
                deleteStore.delete(requestData.id);
                deleteTransaction.oncomplete = () => console.log('Request deleted from IndexedDB');
            }
        } catch (err) {
            console.error('Failed to sync request', err);
        }
    }
}