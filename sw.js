const CACHE_NAME = 'apoyo-financiero-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/registro.html',
  '/admin.html',
  '/styles.css',
  '/script.js',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});</content>
<parameter name="filePath">c:\MisProyectos\apoyo-financiero-web\sw.js