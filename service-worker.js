// Service Worker Config
const CONFIG_CACHE_NAME = 'soccer-v0.0.1'
const CONFIG_CACHE_URLS = [
  '/',
  '/css/materialize.min.css',
  '/images/icon-72x72.png',
  '/images/icon-96x96.png',
  '/images/icon-128x128.png',
  '/images/icon-144x144.png',
  '/images/icon-192x192.png',
  '/images/icon-256x256.png',
  '/images/icon-384x384.png',
  '/images/icon-512x512.png',
  '/images/sick.png',
  '/images/sport-cup.png',
  '/images/sport-podium.png',
  '/images/sport-watch.png',
  '/images/sport-done.png',
  '/images/sport-ribbon.png',
  '/main.js',
  '/js/idb.min.js',
  '/js/materialize.min.js',
  '/js/index.js',
  '/js/football-data.js',
  '/js/pages/first-access.js',
  '/js/pages/home.js',
  '/js/pages/league.js',
  '/js/pages/schedule.js',
  '/js/pages/team.js',
  '/js/pages/favorite.js',
  '/index.html',
  '/pages/first-access.html',
  '/pages/home.html',
  '/pages/league.html',
  '/pages/league/detail.html',
  '/pages/schedule.html',
  '/pages/team.html',
  '/pages/favorite.html'
]
CONFIG_API_URL = 'http://localhost:3000/users/api/v1'

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CONFIG_CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(CONFIG_CACHE_URLS)
      })
  )
})

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (cacheNames) {
        return Promise.all(
          cacheNames.map(function (cacheName) {
            if (cacheName !== CONFIG_CACHE_NAME) {
              console.log(`Service worker: cache ${cacheName} deleted`)

              return caches.delete(cacheName)
            }
          })
        )
      })
  )
})

self.addEventListener('fetch', function (event) {
  if (event.request.url.indexOf(CONFIG_API_URL) > -1) {
    event.respondWith(
      caches.open(CONFIG_CACHE_NAME)
        .then(function (cache) {
          return fetch(event.request)
            .then(function (response) {
              cache.put(event.request.url, response.clone())
              return response
            })
        })
    )
  } else {
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true })
        .then(function (response) {
          return response || fetch(event.request)
        })
    )
  }
})
