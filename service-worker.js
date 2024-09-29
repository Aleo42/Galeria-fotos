const CACHE_NAME = 'gallery-cache-v1';
const urlsToCache = [
    '/',           // Cacheamos la ruta raíz
    '/index.html', // Cacheamos el archivo index
    '/style.css',  // Cacheamos los estilos
    '/script.js'   // Cacheamos el script principal
];

// Instalación del evento del Service Worker, cacheando todos los recursos iniciales
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        }).catch((error) => console.error('Error al abrir el caché:', error))
    );
});

// Fetch (peticiones) del Service Worker
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Si hay una respuesta en la caché, la devolvemos
            if (response) {
                return response;
            }

            // Si no está en caché, hacemos la solicitud a la red
            return fetch(event.request).then((networkResponse) => {
                // Verificamos que la respuesta sea válida y la almacenamos en caché
                if (networkResponse && networkResponse.status === 200 && !event.request.url.includes('chrome-extension')) {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                }

                return networkResponse;
            }).catch(() => {
                // Si no hay conexión, puedes devolver un recurso alternativo (por ejemplo, una página o imagen de fallback)
                if (event.request.url.endsWith('.html')) {
                    return caches.match('/offline.html'); // Asegúrate de cachear este archivo
                } else if (event.request.url.endsWith('.jpg') || event.request.url.endsWith('.png')) {
                    return caches.match('/fallback-image.jpg'); // Cachea esta imagen en el evento de instalación
                }
                return new Response('No estás conectado a internet');
            });
        })
    );
});
