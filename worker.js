// Do the actual work of getting a message
console.log('worker.js launched');
function getMessage() {
  var x = new XMLHttpRequest();
  x.open('GET', '/sleep/timeout', false);
  //x.responseType = "arraybuffer";

  var result = [];
  x.onload = function(e) {
    if (e.target.response) {
        var messages = new Uint8Array(e.target.response)
        var messagesLength = messages.length;
        var currIdx = 0;
        var enc = new TextDecoder("utf-8");
    
        while (messagesLength > currIdx) {
            var view = new DataView(messages.buffer, currIdx);
            var messageLength = view.getUint32();
            // Get the binary rep of the msg
            currIdx += 4;
            var message = messages.slice(currIdx, currIdx + messageLength);
            currIdx += messageLength;
            var str = enc.decode(message);
            var obj = JSON.parse(str);
            result.push(obj);
        }
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

(function workerStart() {
  console.log('workerStart+');
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

