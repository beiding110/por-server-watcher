// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// const ele = require('electron');
const remote = require('@electron/remote');
const { ipcRenderer, shell } = require('electron');
const os = require('os');

const package = require('../package.json');

window.remote = remote;
window.ipcRenderer = ipcRenderer;
window.shell = shell;

// mac地址
const networkInterfaces = os.networkInterfaces();

var mac = '无法获取mac地址';

if (networkInterfaces.WLAN) {
    mac = networkInterfaces.WLAN[0].mac;
} else if (networkInterfaces['以太网'] || networkInterfaces['Ethernet']) {
    mac = (networkInterfaces['以太网'] || networkInterfaces['Ethernet'])[0].mac;
} else if (
    networkInterfaces['本地连接'] ||
    networkInterfaces['Local Connection']
) {
    mac = (networkInterfaces['本地连接'] ||
        networkInterfaces['Local Connection'])[0].mac;
}

// 计算机名称
// const name = os.hostname(); // 部分设备中调用报错

var ecenter = {};

window.electronApi = {
    addEventListener: (ename, handler) => {
        ecenter[ename] = handler;
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
    ssb: package.ssb, // 业务推荐
    ssc: package.ssc, // 用户推荐

    request({ url, success, error, complete }) {
        const request = remote.net.request(url);
    
        request.on('response', (res) => {
            if (res.statusCode === 200) {
                success && success();
            } else {
                error && error();
            };

            complete && complete();
        });
    
        request.end();
    },
};

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
        });

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

window.addEventListener('keydown', (e) => {
    if (e.key === 'F12') {
        ipcRenderer.send('dev-tools');
    }
});
