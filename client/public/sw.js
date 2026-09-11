const CACHE_NAME = 'samriddhisetu-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Install: cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching app shell');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: Cache-first for app shell, network-first for API
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API calls: network-first with cache fallback
  if (url.pathname.startsWith('/api')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Static assets: cache-first
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      });
    })
  );
});

// Background sync for offline voice/form data
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-applications') {
    event.respondWith(syncApplications());
  }
});

async function syncApplications() {
  try {
    // Pull from IndexedDB and push to server
    const db = await openDB();
    const tx = db.transaction('pendingApplications', 'readonly');
    const store = tx.objectStore('pendingApplications');
    const pending = await getAllFromStore(store);

    for (const app of pending) {
      try {
        await fetch('/api/apply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(app),
        });
        // Remove synced item
        const deleteTx = db.transaction('pendingApplications', 'readwrite');
        deleteTx.objectStore('pendingApplications').delete(app.id);
      } catch (err) {
        console.log('[SW] Sync failed for:', app.id);
      }
    }
  } catch (err) {
    console.error('[SW] Background sync error:', err);
  }
}

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('SamriddhiSetuDB', 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('pendingApplications')) {
        db.createObjectStore('pendingApplications', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('voiceRecordings')) {
        db.createObjectStore('voiceRecordings', { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getAllFromStore(store) {
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
