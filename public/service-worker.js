const APP_PREFIX = "BudgetTracker-";
const VERISON = "version_01";
const CACHE_NAME = APP_PREFIX + VERISON;
const FILES_TO_CACHE = [
  "./css/styles.css",
  "./js/index.js",
  "./js/idb.js",
  "./index.html",
  "./manifest.json",
];

self.addEventListener("fetch", function (e) {
  console.log("fetch request : " + e.request.url);
  e.respondWith(
    caches.match(e.request).then(function (req) {
      if (req) {
        console.log("responding with cache : " + e.request.url);
        return req;
      } else {
        console.log("file is nor cached, fetching : " + e.request.url);
        return fetch(e.request);
      }
    })
  );
});

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("installing cache : " + CACHE_NAME);
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      let cacheKeepList = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      });
      cacheKeepList.push(CACHE_NAME);
      return Promise.all(
        keyList.map(function (key, i) {
          if (cacheKeepList.indexOf(key) === -1) {
            console.log("deleting cache : " + keyList[i]);
            return cache.delete(keyList[i]);
          }
        })
      );
    })
  );
});
