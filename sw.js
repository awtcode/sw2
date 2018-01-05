var messages = [];
self.addEventListener('fetch', function(e) {
  //console.log('fetch:' + e.request.url);
  if (e.request.url.endsWith('timeout')) {
    var result = (messages.length > 0) ? messages : null;
    //console.log("sw.js: msg:" + result + " length:" + messages.length);
    e.respondWith(new Promise(function(accept, reject) {
       setTimeout(function() {
         accept(new Response(result));
         messages = [];
       }, 1000);
     }));
  } else {
    e.respondWith(fetch(e.request));
  }
});

self.onmessage = function(event) {
  console.log("sw.js receive from syncxhr.html data:" + event.data);
  messages.push(event.data);
}
