var staticCacheName = 'ristaurant-static-v1';

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(staticCacheName).then(function (cache) {
            return cache.addAll([
                '/',
                '/index.html',
                '/restaurant.html',
                'js/dbhelper.js',
                'js/main.js',
                'js/restaurant_info.js',
                'css/styles.css',
                '/data/restaurants.json'
            ]);
        }).catch(function (err) {
            console.log('Install : cache error ' + err)
        })
    );
});


self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    return cacheName.startsWith('ristaurant-') &&
                        cacheName != staticCacheName;
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});


self.addEventListener('fetch', function (event) {
    // TODO: respond to requests for the root page with
    // the page skeleton from the cache
    let requestUrl = new URL(event.request.url);

    if (requestUrl.origin === location.origin) {
        if (requestUrl.pathname === '/') {
            event.respondWith(caches.match('/index.html'));
            return;
        }

    }
    let url
    if (event.request.url.includes('restaurants.json')) {
        url = '/data/restaurants.json';
    } else if (event.request.url.includes('restaurant.html')) {
        url = '/restaurant.html';
    } else {
        url = event.request.url;
    }
    event.respondWith(
        caches.match(url).then(function (response) {
            console.log(event.request);
            return response || fetch(event.request);
        })
    );
});