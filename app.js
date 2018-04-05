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
let _resolveId = null;
let _winId = null;
async function getId() {    
    _reg.active.postMessage('resolveId');
    return new Promise((resolve, reject) => {
        _resolveId = resolve;
    })
}
async function handleResolve() {
    console.log('SW is activated!!! proceed');
        await getId().then((winId) => {
            console.log('winId resolved:' + winId);
            _resolveId = winId;
        });
}

async function main() {
    await init().then(handleResolve, function() {
        //window.location.reload(true);
    })
    console.log('Creating worker with winId:' + _resolveId);
    let w = new Worker('worker.js');
    //w.postMessage({eventType:'initWndId', wndId:_winId});
    w.postMessage("testtest");
}

main();

navigator.serviceWorker.addEventListener('message', function(e) {
    if (e.data.resolveIdDone = 1) {
        _resolveId(e.data.winId);    
    }
});