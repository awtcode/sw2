"# syncxhr" 

A very simple prototype to support Fabric's messaging requirements without SharedArrayBuffers or Emterpreter. The requirements include the following:

1. Able to receive messsages on a Web Worker in a blocking while loop.
2. Able to coalesce group of messages to improve performance

Known Issues:
1. For some reason, the service worker doesn't load after a clear cache and the Web Worker proceeds do a xhr GET. Reload the browser twice to mitigate this problem for now.
2. Do not clear the messages array in sw.js for now as the Web Worker gets a null response. Find a way to clear the messages after the Web Worker has received them.

Run:
Simply start a node or python server and observe the printouts in the Chrome console. 

