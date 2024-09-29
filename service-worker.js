const CACHE_NAME = 'gallery-cache-v1';
const urlsToCache = [
    '/', //cacheamos la rama principal
    '/index.html', //cacheamos el index o main
    '/style.css', //cacheamos los estilos
    '/script.js'//cacheamos los script
];

// Instalación del evento del service worker, cacheando todos los recursos iniciales
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

// Fetch (peticiones) del service worker
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Si hay una respuesta en la caché, la devolvemos
            if (response){
                return response;
            }
            
            // Si no, hacemos la solicitud a la red
            return fetch(event.request).then((networkResponse) => {
                // Si la solicitud es exitosa, almacenamos en caché
                if (networkResponse && networkResponse.status === 200 && event.request.url.includes('jsonplaceholder.typicode.com/photos')){
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                }

                return networkResponse;
            }).catch(function(){
                // Si no hay conexión, devolvemos un mensaje 
                return new Response('No estás conectado a internet');
            });
        })
    );
});
