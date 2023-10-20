const { ipcRenderer, contextBridge, } = require('electron');
const os = require('os');

const package = require('../package.json');

// mac地址
const networkInterfaces = os.networkInterfaces(),
    mac = networkInterfaces.WLAN 
        ? networkInterfaces.WLAN[0].mac 
        : (networkInterfaces['以太网'] || networkInterfaces['Ethernet'])[0].mac;

// 计算机名称
const name = os.hostname();

var ecenter = {};

contextBridge.exposeInMainWorld('electronApi', {
    addEventListener: (ename, handler) => {
        ecenter[ename] = handler
    },
    removeEventListener: (ename) => {
        ecenter[ename] = null;
    },
    dispatch: (ename, data) => {
        ipcRenderer.send('view-main', {
            name: ename,
            data,
        });
    },
    getE() {
        return ecenter;
    },
    notify(...args) {
        ipcRenderer.send('notify', args);
    },
    modalNotify(obj) {
        ipcRenderer.send('modalNotify', obj);
    },
    version: package.version, //应用版本号
    mac, //mac地址
    name, //计算机名称
});

console.log('proload of view injected');

/**
 * 主线程通知进行before-close
 */
ipcRenderer.on('before-close', (e) => {
    let beforeClose = ecenter['beforeClose'];

    if (beforeClose && typeof beforeClose === 'function') {
        // 调用view注册的beforeClose事件
        beforeClose(() => {
            // 调用完毕后给主线程返回before-close-done事件
            e.sender.send('before-close-done');
        })

        return;
    }

    e.sender.send('before-close-done');
});

ipcRenderer.on('main-view', (e, data) => {
    var ename = data.name,
        handler = ecenter[ename];

    if (handler && typeof handler === 'function') {
        handler();
    }
});