var VERSION = 'v2';

// sw.js
self.addEventListener('install', function (event) {
  // event.waitUntil(self.skipWaiting());
  event.waitUntil(

    // 创建一个缓存
    caches.open(VERSION).then(function (cache) {
      
      // 添加要缓存的资源
      return cache.addAll([
        '/pwa/',
        '/pwa/index.html',
        '/pwa/style.css',
        '/pwa/app.js',
        '/pwa/image-list.js',
        '/pwa/star-wars-logo.jpg',
        '/pwa/gallery/bountyHunters.jpg',
        '/pwa/gallery/myLittleVader.jpg',
        '/pwa/gallery/snowTroopers.jpg'
      ]);
    })
  );
});


// sw.js 管理请求
this.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function () {
      return fetch(event.request).then(function (response) {
        return caches.open(VERSION).then(function (cache) {
          self.registration.showNotification(`缓存了资源`);
          cache.put(event.request, response.clone());
          return response;
        });
      });
    }).catch(function (err) {
      console.log(err);
      
      return caches.match('/pwa/gallery/myLittleVader.jpg');
    })
  );
});


self.addEventListener('activate', function (event) {
  // sw.js 向用户发送通知
  var cacheWhitelist = [];
  self.registration.showNotification('进入激活状态！');

  // 需要在install中配合 event.waitUntil(self.skipWaiting());
  event.waitUntil(self.clients.claim());
  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});



self.addEventListener('push', function (event) {
  event.waitUntil(
    self.registration.showNotification &&
    self.registration.showNotification('some message') 
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
});

self.addEventListener('notificationclose', function (event) {
  // do something
});
