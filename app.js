

function registerServiceWorker() {
  return navigator.serviceWorker.register('./sw.js', {scope: './'})
    .then(registration => {
      console.log('Service worker successfully registered.');
      return registration;
    })
    .catch(err => {
      console.error('Unable to register service worker.', err);
    });
}


// 获取发送通知权限
let promiseChain = new Promise((resolve, reject) => {
  const permissionPromise = Notification.requestPermission(result => {
    resolve(result);
  });
  if (permissionPromise) {
    permissionPromise.then(resolve);
  }
}).then(result => {
  if (result === 'granted') {
    registerServiceWorker().then(registration => {
      // 
      registration.showNotification('Hello World!');
    });
  } else {
    registerServiceWorker();
  }
});








function imgLoad(imgJSON) {
  // return a promise for an image loading
  return new Promise(function (resolve, reject) {
    var request = new XMLHttpRequest();
    request.open('GET', imgJSON.url);
    request.responseType = 'blob';

    request.onload = function () {
      if (request.status == 200) {
        var arrayResponse = [];
        arrayResponse[0] = request.response;
        arrayResponse[1] = imgJSON;
        resolve(arrayResponse);
      } else {
        reject(Error('Image didn\'t load successfully; error code:' + request.statusText));
      }
    };

    request.onerror = function () {
      reject(Error('There was a network error.'));
    };

    // Send the request
    request.send();
  });
}

var imgSection = document.querySelector('section');
console.log(Gallery);

window.onload = function () {

  // load each set of image, alt text, name and caption
  for (var i = 0; i <= Gallery.images.length - 1; i++) {
    imgLoad(Gallery.images[i]).then(function (arrayResponse) {

      var myImage = document.createElement('img');
      var myFigure = document.createElement('figure');
      var myCaption = document.createElement('caption');
      var imageURL = window.URL.createObjectURL(arrayResponse[0]);

      myImage.src = imageURL;
      myImage.setAttribute('alt', arrayResponse[1].alt);
      myCaption.innerHTML = '<strong>' + arrayResponse[1].name + '</strong>: Taken by ' + arrayResponse[1].credit;

      imgSection.appendChild(myFigure);
      myFigure.appendChild(myImage);
      myFigure.appendChild(myCaption);

    }, function (Error) {
      console.log(Error);
    });
  }
};
