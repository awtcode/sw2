// navigator.serviceWorker.oncontrollerchange = function() {
//     console.log("syncxhr.html navigator.serviceWorker.oncontrollerchange activated!!!");
// }

// navigator.serviceWorker.register('sw.js').then  (function(reg) {
//       var w = new Worker('worker.js');
//       var count = 0;
//       //setInterval(function(){ 
//         if (navigator.serviceWorker.controller !== null) {
//             var obj = {};
//             obj.index = count;
//           navigator.serviceWorker.controller.postMessage(obj); 
//           console.log("syncxhr.html navigator.serviceWorker.controller NOT null!!!");
//         } else {
//           console.log("syncxhr.html navigator.serviceWorker.controller is null!!!");
//           window.location.reload(true);
//         }
//       //}, 3000);
//     }).catch(function(e) {
//       console.log(e);
//     });
var _reg = null;
function init() {    
    return new Promise((resolve, reject) => {
        navigator.serviceWorker.register("sw9.js", { scope:'/' }).then(function (reg) {
        _reg = reg;
                        if (_reg.active === null) {
                            var installingWorker = _reg.installing;
                            installingWorker.onstatechange = function (stateEvt) {
                                if (stateEvt.target.state === "activated") {
                                    console.log('cold reload SW activated, resolving!!!');
                                    resolve();
                                }
                            };
                        } else {
                            console.log('warm reload SW active:' + _reg.active.scriptURL);
                            _installingWarmWorker = _reg.installing;
                            if (_installingWarmWorker) {
                                console.log('We are going to install SW:' + _installingWarmWorker.scriptURL);
                                _reg.onupdatefound = function (newreg) {
                                    
                                    _reg = null;
                                    
                                    newreg.currentTarget.installing.onstatechange = function (stateEvt) {
                                        console.log('warm reload.onstatechange: svc wkr stateEvt.target.state:' + stateEvt.target.state);
                                        if (stateEvt.target.state === 'activated') {
                                            console.log('warm reload: svc wkr state is activated, resolving now!!!');
                                            resolve();
                                            _reg = newreg.currentTarget;
                                        }
                                    };
                                };
                            } else {
                                console.log('Posting claim');
                                reg.active.postMessage('claim');
                                resolve();
                            }
                        }
        });
    });
}

async function main() {
    await init().then(function() {
        //window.location.reload(true);
        console.log('SW is activated!!! proceed');
        var w = new Worker('worker.js');
        _reg.active.postMessage('from app.js to worker.js');
    }, function() {
        //window.location.reload(true);
    })
}

main();