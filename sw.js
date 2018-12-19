var VERSION = 'v1';

// sw.js
self.addEventListener('install', function (event) {

  // event.waitUntil(self.skipWaiting());
  // ...

  event.waitUntil(

    // 创建一个缓存
    caches.open(VERSION).then(function (cache) {
      
      // 添加要缓存的资源
      return cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        '/app.js',
        '/image-list.js',
        '/star-wars-logo.jpg',
        '/gallery/bountyHunters.jpg',
        '/gallery/myLittleVader.jpg',
        '/gallery/snowTroopers.jpg',
        '/gallery/test.png'
      ]);
    })
  );
});


// sw.js 管理请求
this.addEventListener('fetch', function (event) {
   event.respondWith(
    caches.match(event.request).then(function (response) {
      // 来来来，代理可以搞一些代理的事情

      // 如果 Service Worker 有自己的返回，就直接返回，减少一次 http 请求
      if (response) {
        return response;
      }

      // 如果 service worker 没有返回，那就得直接请求真实远程服务
      var request = event.request.clone(); // 把原始请求拷过来
      return fetch(request).then(function (httpRes) {

        // http请求的返回已被抓到，可以处置了。

        // 请求失败了，直接返回失败的结果就好了。。
        if (!httpRes || httpRes.status !== 200) {
          return httpRes;
        }

        // 请求成功的话，将请求缓存起来。
        var responseClone = httpRes.clone();
        caches.open(VERSION).then(function (cache) {
          cache.put(event.request, responseClone);
        });

        return httpRes;
      });
    }).catch(function () {
      return caches.match('/gallery/myLittleVader.jpg');
    })
   );
});

// 捕获请求并返回缓存数据
// self.addEventListener('fetch', function (event) {
//   event.respondWith(caches.match(event.request).catch(function () {
//     return fetch(event.request);
//   }).then(function (response) {
//     caches.open(VERSION).then(function (cache) {
//       self.registration.showNotification(`缓存了资源`);
//       cache.put(event.request, response);
//     });
//     return response.clone();
//   }).catch(function () {
//     return caches.match('/gallery/myLittleVader.jpg');
//   }));
// });


self.addEventListener('activate', function (event) {

  // 需要在install中配合 event.waitUntil(self.skipWaiting());
  // event.waitUntil(self.clients.claim());

  // sw.js 向用户发送通知
  var cacheWhitelist = [];
  self.registration.showNotification('进入激活状态！');

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
