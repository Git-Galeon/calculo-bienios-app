const CACHE_NAME = 'fluxi-cache-v1.6';

// Solo almacenamos en caché los archivos locales de tu repositorio
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg'
];

// Instalar Service Worker y guardar en caché local
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Interceptar peticiones y servir desde caché si no hay red
self.addEventListener('fetch', (event) => {
  // Ignorar peticiones a Google Apps Script y CDNs externos (evita errores CORS en consola)
  if (
    event.request.url.includes('script.google.com') || 
    event.request.url.includes('cdn.tailwindcss.com') ||
    event.request.url.includes('cdnjs.cloudflare.com') ||
    event.request.url.includes('cdn.jsdelivr.net')
  ) {
    return; // Deja que el navegador maneje estas peticiones normalmente
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Devuelve la caché si la encuentra, sino busca en internet
        return response || fetch(event.request);
      })
  );
});

// Limpiar cachés viejas al actualizar
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
