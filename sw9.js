console.log("sw9.js initialized!!!");
var messages = [];
self.addEventListener('fetch', function(e) {
  //console.log('fetch:' + e.request.url);
  if (e.request.url.endsWith('timeout')) {
    var result = (messages.length > 0) ? messages : null;
    clients.matchAll().then(clients => { 
      console.log("Number of controlled clients:" + clients.length); 
      console.log('After resolve client id:' + e.clientId);
      for (var i=0; i<clients.length; ++i) {
        console.log('client:' + clients[i]);
      }
    });

    console.log('client id:' + e.clientId);
    
    e.respondWith(new Promise(function(accept, reject) {
       setTimeout(function() {
        
        //if (messages.length === 0)
          //return;

        console.log("sw.js: sending back to worker.js msg:" + result + " length:" + messages.length);
        accept(new Response(result));
         messages = []; // Do not clear the messsages for now, it voids the result in worker.js!!!
       }, 1000);
     }));
   } else {
     e.respondWith(fetch(e.request));
   }
});

self.onmessage = function(event) {
  if (event.data === 'claim') {
    // console.log('sw.js claiming clients');
    clients.claim();
  } else if (event.data === 'resolveId') {
    let obj = {};
    obj.resolveIdDone = 1;
    obj.winId = event.source.id;
    clients.get(event.source.id).then((client) => {
      console.log('sw post winId back to app.js winId:' + event.source.id);
      client.postMessage(obj);
    });
  }
  console.log(`sw.js receive from syncxhr.html with sourceid "${event.source.id}" And with data: "${event.data}"`);
  messages.push(event.data);
}

self.addEventListener('install', function(event) {
  console.log("sw.js install event:" + event);
    event.waitUntil(self.skipWaiting()); // Activate worker immediately
});

self.addEventListener('activate', function(event) {
  console.log("sw.js activate event:" + event);
    event.waitUntil(self.clients.claim()); // Become available to all pages
});