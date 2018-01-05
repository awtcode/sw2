console.log("sw.js initialized!!!");
var messages = [];
self.addEventListener('fetch', function(e) {
  //console.log('fetch:' + e.request.url);
  if (e.request.url.endsWith('timeout')) {
    var result = (messages.length > 0) ? messages : null;
    
    e.respondWith(new Promise(function(accept, reject) {
       setTimeout(function() {
         console.log("sw.js: sending back to worker.js msg:" + result + " length:" + messages.length);
          accept(new Response(result));
         //messages = [];
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
