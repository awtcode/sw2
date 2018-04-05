// Do the actual work of getting a message
console.log('worker.js launched');
function getMessage() {
  var x = new XMLHttpRequest();
  x.open('GET', '/sleep/timeout', false);
  //x.responseType = "arraybuffer";

  var result = [];
  x.onload = function(e) {
    if (e.target.response) {
       result.push[e.target.response];
    } else {
      console.log('response is null');
    }
  }
  console.log('worker.js send+');
  x.send(null);
  console.log("worker.js: send- result: " + result);
  return result;
}

// Do busy-waiting, do not proceed until we get a message
function subReceiveMessage() {
  do {
    var message = getMessage();
    if (message.length > 0) {
      console.log("worker.js receive msg:" + message);
      return message;
    }
  } while (1);
}

// (function workerStart() {
//   console.log('workerStart+');
//   for (;;) {
//     do {
//     var message = subReceiveMessage();
//     if (message) {
//       console.log("worker.js receive msg:" + message);
//       break;
//     }
//   } while (1);
//   console.log("worker.js msg received!!! exit while loop!!!");
//   }  
// })();
let _wndId = null;
// onmessage = (e) => {
//   if (e.data.eventType === 'initWndId') {
//     _wndId = e.data.wndId;
//   }
// }

self.onmessage = function (msg) {
  this.console.log('worker received');
}
