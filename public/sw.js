const CACHE_NAME = 'alphaya-static-v1';
const OFFLINE_URLS = [
  '/',
  '/favicon.ico'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_URLS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip API routes and auth routes - don't cache these
  const url = new URL(request.url);
  if (url.pathname.startsWith('/api/') || 
      url.pathname.startsWith('/auth/') ||
      url.pathname.startsWith('/_next/') ||
      url.pathname.includes('_rsc')) {
    // Let these pass through without caching
    return;
  }
  
  event.respondWith(
    caches.match(request).then((cached) => {
      // If we have a cached version, return it immediately
      if (cached) {
        // Try to update cache in background
        fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
        }).catch(() => {
          // Ignore fetch errors in background update
        });
        return cached;
      }
      
      // No cache, fetch from network
      return fetch(request)
        .then((networkResponse) => {
          // Only cache successful responses
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(() => {
          // If network fails and no cache, return a proper offline response
          // This prevents undefined from being returned
          return new Response('Offline', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          });
        });
    })
  );
});


