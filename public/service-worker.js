const APP_PREFIX = "budgetTracker";
const VERSION = "version_01";
const CACHE_NAME = APP_PREFIX + VERSION;
const FILES_TO_CACHE = [
    "/", "/index.html","index.js", "/db.js", "/style.css", "/manifest.json", "/service-workers.js"];

    self.addEventListener("install", function (event) {
        event.waitUntil(
            caches.open(CACHE_NAME).then(function (cache) {
                console.log("installing: " + CACHE_NAME);
                return cache.addAll(FILES_TO_CACHE);
            })
        )
    });
    
    self.addEventListener("activate", function (event) {
        event.waitUntil(
            caches.keys().then(keyList => {
                return Promise.all(
                    keyList.map(key => {
                        if (key !== CACHE_NAME) {
                            console.log("Deleting cache", key);
                            return caches.delete(key);
                        }
                    })
                );
            })
        );
        self.clients.claim();
    });
    
    self.addEventListener("fetch", function (event) {
        if (event.request.url.includes("/api/")) {
            event.respondWith(
                caches.match(event.request).then(function (request) {
                    if (request) {
                        return request;
                    } else {
                        return fetch(event.request);
                    }
                })
            );
        }
    });