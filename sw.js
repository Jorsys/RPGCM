const CACHE_NAME = "rpg-character-manager-v1"
const urlsToCache = [
  "/",
  "/index.html",
  "/login.html",
  "/personaje.html",
  "/ficha-personaje.html",
  "/styles.css",
  "/utils.js",
  "/login.js",
  "/personaje.js",
  "/ficha-personaje.js",
  "/component-loader.js",
  "/manifest.json",
  "/icons/icon-72x72.png",
  "/icons/icon-96x96.png",
  "/icons/icon-128x128.png",
  "/icons/icon-144x144.png",
  "/icons/icon-152x152.png",
  "/icons/icon-192x192.png",
  "/icons/icon-384x384.png",
  "/icons/icon-512x512.png",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-regular-400.woff2",
]

// Componentes modulares
const componentPaths = [
  "/components/header.html",
  "/components/basic-info.html",
  "/components/attributes.html",
  "/components/status.html",
  "/components/grimorio.html",
  "/components/equipment.html",
  "/components/inventory/main.html",
  "/components/inventory/resources.html",
  "/components/inventory/accordion.html",
  "/components/inventory/special-bags.html",
  "/components/modals/edit-equipped-modal.html",
  "/components/modals/create-spell-modal.html",
  "/components/modals/item-modal.html",
  "/components/modals/resource-modal.html",
  "/components/modals/sell-item-modal.html",
  "/components/modals/move-to-bag-modal.html",
  "/components/modals/create-bag-modal.html",
  "/components/modals/confirm-modal.html",
]

// Combinar todas las URLs para cachear
const allUrlsToCache = [...urlsToCache, ...componentPaths]

// Instalación del Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Cache abierto")
        return cache.addAll(allUrlsToCache)
      })
      .then(() => self.skipWaiting()),
  )
})

// Activación del Service Worker
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME]
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => self.clients.claim()),
  )
})

// Estrategia de caché: Cache First, luego Network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Si el recurso está en caché, lo devolvemos
      if (response) {
        return response
      }

      // Si no está en caché, lo buscamos en la red
      return fetch(event.request)
        .then((networkResponse) => {
          // Si la respuesta no es válida, devolvemos la respuesta tal cual
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic") {
            return networkResponse
          }

          // Clonamos la respuesta porque la vamos a usar dos veces
          const responseToCache = networkResponse.clone()

          // Guardamos la respuesta en caché para futuras solicitudes
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })

          return networkResponse
        })
        .catch((error) => {
          // Si hay un error en la red, podemos devolver una página de fallback
          console.error("Error en fetch:", error)

          // Si es una solicitud de página HTML, podemos devolver una página offline
          if (event.request.headers.get("accept").includes("text/html")) {
            return caches.match("/offline.html")
          }

          return new Response("Error de red, no se pudo cargar el recurso.")
        })
    }),
  )
})

// Sincronización en segundo plano para guardar datos cuando se recupere la conexión
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-personajes") {
    event.waitUntil(syncPersonajes())
  }
})

// Función para sincronizar datos pendientes
async function syncPersonajes() {
  // Aquí implementaríamos la lógica para sincronizar datos con un servidor
  // Por ahora, solo registramos en consola
  console.log("Sincronizando datos de personajes...")

  // En una implementación real, aquí enviaríamos los datos al servidor
  // const pendingData = await getPendingData();
  // await sendToServer(pendingData);
}
