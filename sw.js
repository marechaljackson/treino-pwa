// Nome do cache (troque o número quando mudar arquivos)
const CACHE_NAME = "treino-offline-v1";

// Arquivos que serão guardados para uso offline
const FILES_TO_CACHE = [  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png"
];

// Instalação: guarda arquivos no cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Ativação: limpa caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch: responde primeiro do cache, depois da rede (cache first)
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Só tratar GET
  if (request.method !== "GET") return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(request).catch(() => {
        // se quiser, aqui você pode retornar uma página offline específica
        return caches.match("/index.html");
      });
    })
  );
});
