const CACHE_KANELASS =  'KanelassV1';

/** Archivos para el cacheo del app se colocan en un array */
let urlCache = [
    '../',
    '../css/index.css',
    '../css/contacto.css',
    '../css/educacion.css',
    '../css/experiencia.css',
    '../assets/sena.PNG',
    '../assets/udea.PNG',
    '../assets/udemy.PNG',
    '../documets/CVLUISAPORRAS.pdf' ,
  ];
  
  /** Instalar la app con el evento install y va a guardar en cache urlCache */
self.addEventListener('install', (e) => {
    e.waitUntil(
      caches.open(CACHE_KANELASS)
        .then(cache => {
          return cache.addAll(urlCache)
            .then(() => {
              self.skipWaiting(); // Hace esperar que se cargue el array en cache
            });
        })
        .catch(err => {
          console.error("No se ha registrado la cache" + err);
        })
    );
  });
  
  /** Activar la app con el evento activate */
self.addEventListener("activate", event => {
    async function deleteOldCaches() {
      // Listar todas las caches por sus nombres.
      const names = await caches.keys();
      await Promise.all(names.map(name => {
        if (name !== CACHE_KANELASS) {
          // Si el nombre de la caché no es el actual, eliminarla.
          return caches.delete(name);
        }
      }));
    }
  
    event.waitUntil(deleteOldCaches());
    self.clients.claim();
  });
  
  self.addEventListener("fetch", (e) => {
    e.respondWith(
      caches.match(e.request).then((r) => {
        console.log("[Servicio Worker] Obteniendo recurso: " + e.request.url);
        return (
          r ||
          fetch(e.request).then((response) => {
            return caches.open(CACHE_KANELASS).then((cache) => {
              console.log(
                "[Servicio Worker] Almacena el nuevo recurso: " + e.request.url
              );
              cache.put(e.request, response.clone());
              return response;
            });
          })
        );
      })
    );
  });
  