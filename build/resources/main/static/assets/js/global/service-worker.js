// the cache version gets updated every time there is a new deployment
var CACHE_VERSION = 'v1.1.'+new Date().getUTCDate();
var CURRENT_CACHE = `main-${CACHE_VERSION}`;

// these are the routes we are going to cache for offline support543-
var cacheFiles = ['/assets/vendor/fonts/fontawesome.css',
					'/assets/vendor/fonts/ionicons.css',
					'/assets/css/demo.css',
					'/assets/css/generics.css',
					'/assets/css/IDE.css',
					'/assets/vendor/css/pages/contacts.css',
					'/assets/js/global/cluster.js',
					'/assets/js/global/dtc-cluster.js',
					'/assets/js/global/dtc-common.js',
					'/assets/js/global/dtc-member.js',
					'/assets/js/admin/dtc-product.js',
					'/assets/js/global/dtc-global.js',
					'/assets/js/theme-settings.js',
					'/assets/js/global/dtc-log-tracker.js',
					'/assets/js/admin/dtc-module.js',
					'/assets/js/engine/init.js',
					'/assets/js/ui_tooltips.js',
					'/assets/js/IDE.js',
					'/assets/js/global/dtc-global-init.js',
					'/assets/js/desk/dtc-store.js',
					'/assets/js/global/dtc-fileupload-wizard.js',
					'/assets/js/desk/dtc-maps.js',
					'/assets/js/global/dtc-layer-styler.js',
					'/assets/vendor/js/sidenav.js',
					];

// on activation we clean up the previously registered service workers
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          //if (cacheName !== CURRENT_CACHE) {
            return caches.delete(cacheName);
          //}
        })
      );
    })
  )
});

// on install we download the routes we want to cache for offline
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CURRENT_CACHE).then(cache => {
      return cache.addAll(cacheFiles);
    })
  )
});

// fetch the resource from the network
const fromNetwork = (request, timeout) =>
  new Promise((fulfill, reject) => {
    const timeoutId = setTimeout(reject, timeout);
    fetch(request).then(response => {
      clearTimeout(timeoutId);
      fulfill(response);
      update(request);
    }, reject);
  });

// fetch the resource from the browser cache
const fromCache = request =>
  caches
    .open(CURRENT_CACHE)
    .then(cache =>
      cache
        .match(request)
        .then(matching => matching || cache.match('/offline/'))
    );

// cache the current page to make it available for offline
const update = request =>
  caches
    .open(CURRENT_CACHE)
    .then(cache =>
      fetch(request).then(response => cache.put(request, response))
    );

// general strategy when making a request (eg if online try to fetch it
// from the network with a timeout, if something fails serve from cache)
self.addEventListener('fetch', event => {
if (event.request.url.indexOf('sessionCheck.do') > -1) {
	return false;
}
 event.respondWith(
    caches.open(CURRENT_CACHE)
      .then(cache => {
        return cache.match(event.request)
          .then(cachedResponse => {
            const fetchPromise = fetch(event.request)
              .then(networkResponse => {
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
              })
              .catch(error => {
                console.error('Fetch failed:', error);
              });

            return cachedResponse || fetchPromise;
          });
      })
  );
});