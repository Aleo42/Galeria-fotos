///////DOM//////
const gridContainer = document.getElementById('grid-container'); // Obtenemos el contenedor del grid

// Asegurarse de que el contenedor existe
if (!gridContainer) {
    console.error('No se encontró el contenedor del grid.');
}

// Registrar el Service Worker si está disponible en el navegador
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
    .then((registration) => {
        console.log('Service Worker registered');
    }).catch((error) => {
        console.log('Service Worker registration failed:', error);
    });
}

// Realizamos la solicitud a la API para obtener las fotos
fetch('https://jsonplaceholder.typicode.com/photos')
    .then(response => response.json())
    .then(data => {
        // Recorremos cada foto devuelta por la API
        data.forEach((photo, index) => { 
            // Creamos el enlace de cada foto
            const anchor = document.createElement('a');
            anchor.href = photo.url;  // Cambiamos al enlace correcto de la imagen completa

            // Creamos la imagen
            const img = document.createElement('img');
            img.src = photo.thumbnailUrl;
            img.alt = `Imagen ${index + 1}`;
            img.loading = 'lazy'; // Carga diferida

            // Creamos la descripción de debajo de la imagen
            const descripcion = document.createElement('p');
            descripcion.textContent = photo.title;

            // Añadimos la imagen y la descripción al enlace
            anchor.appendChild(img);
            anchor.appendChild(descripcion);

            // Añadimos el enlace al contenedor del grid
            gridContainer.appendChild(anchor);

            // Asignamos un evento a la descripción para abrir la imagen completa en una nueva pestaña
            descripcion.addEventListener('click', function(event) {
                event.preventDefault(); // Evitamos la redirección
                window.open(photo.url, '_blank'); // Abre la imagen completa en una nueva pestaña
            });
        });
    })
    .catch(error => console.error('Error al cargar las imágenes: ', error)); // Captura un error si algo salió mal
