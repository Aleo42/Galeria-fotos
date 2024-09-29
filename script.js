///////DOM//////
const gridContainer = document.getElementById('grid-container'); // Obtenemos el contenedor del grid

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
            const anchor = document.createElement('a'); // Creamos el enlace
            anchor.href = `https://jsonplaceholder.typicode.com/photos/${photo.id}.html`;

            // Creamos la imagen
            const img = document.createElement('img');
            img.src = photo.thumbnailUrl;
            img.alt = Imagen ${index + 1};
            img.loading = 'lazy'; // Permite que las imágenes se vayan cargando como aparezcan en la vista del usuario

            // Creamos la descripción de debajo de la imagen
            const descripcion = document.createElement('p');
            descripcion.textContent = photo.title; // Usa el título proporcionado por la solicitud Fetch

            // Añadimos la imagen y la descripción al enlace
            anchor.appendChild(img);
            anchor.appendChild(descripcion);

            // Asignamos un evento para evitar redireccionar si hacemos clic en la miniatura
            img.addEventListener('click', function(event){
                event.preventDefault(); // Evita cualquier acción por defecto
            });

            // Añadimos el enlace al contenedor del grid
            gridContainer.appendChild(anchor);

            // Asignamos un evento a cada descripción
            descripcion.addEventListener('click', function(event) {
                event.preventDefault(); //Evita la redirección
                window.open(photo.url); //Nos redirige a la URL de la imagen completa
            });
        });
    })
    .catch(error => console.error('Error al cargar las imágenes: ', error)); //Captura un error si algo salió mal
