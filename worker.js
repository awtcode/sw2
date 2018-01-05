// Do the actual work of getting a message
function getMessage() {
  var x = new XMLHttpRequest();
  x.open('GET', '/sleep/timeout', false);
  
  var result = null;
  x.onload = function(e) {
    console.log('worker.js x.onload:' + e.target.response);
    result = e.target.response;
  }
  x.send(null);
  //console.log("worker.js: send- result: " + result);
  return result;
}

// Simulates Fabric's subReceiveMessage. Do busy-waiting, do not proceed until we get a message
function subReceiveMessage() {
  do {
    var message = getMessage();
    if (message) {
      console.log("worker.js receive msg:" + message);
      return message;
    }
  } while (1);
}

(function fabricStart() {
  for (;;) {
    do {
    var message = subReceiveMessage();
    if (message) {
      console.log("worker.js receive msg:" + message);
      break;
    }
  } while (1);
  console.log("worker.js msg received!!! exit while loop!!!");
  }  
})();

