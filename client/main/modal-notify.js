// 模态提示框

const { BrowserWindow, screen } = require('electron');
const remote = require('@electron/remote/main');
const path = require('path');
const iconTray = require('./tray.js');

class ModalNotify {
    constructor() {
        this._ui = path.join(__dirname, '../html/modal-notify/index.html');
        this.$default_setting = {
            width: 360,
            height: 230,
            show: false,
            y: 0,
            x: 0,
            frame: false, // 无边框
            skipTaskbar: true, // 使窗口不显示在任务栏中
            movable: false, // 禁止窗口被用户移动
            resizable: false, // 禁止窗口手动调整窗口大小
            fullscreenable: false, // 禁止窗口可以进入全屏状态
            alwaysOnTop: true, // 窗口是否永远在别的窗口的上面
            webPreferences: {
                // preload: path.join(__dirname, '../html/modal-notify/js/preload.js'),
                preload: path.join(__dirname, '../preload/window.js'),
                nodeIntergration: true,
                contextIsolation: false,
            },
        };
        this.$win = null;
        this.$data = null;
        this.screen = {};

        this._getScreenInfo();
    };

    _getScreenInfo() {
        const sizeObj = screen.getPrimaryDisplay().workAreaSize;
        const { width, height } = sizeObj;

        this.screen = {
            width,
            height,
        };
    };

    _setPos() {
        // 定位到桌面右下角
        const space = 10;

        const [wWidth, wHeight] = this.$win.getContentSize();
        const left = parseInt(this.screen.width - (wWidth || 0) - space);
        const top = parseInt(this.screen.height - (wHeight || 0) - space);

        this.$win.setPosition(left, top);
    };

    _beforeOpen() {
        this._setPos(); // 设置位置

        remote.enable(this.$win.webContents); // 激活remote

        this.$win.webContents.send('data', this.$data); // 传递参数

        // 关闭时取消闪烁
        this.$win.on('close', () => {
            iconTray.shineEnd();
        });
    };

    _afterOpen() {
        // 开始闪烁
        iconTray.shineStart();

        // Open the DevTools.
        if (process.env.NODE_ENV === 'development') {
            this.$win.openDevTools();
        }
    };

    open(obj) {
        this.close();
        this.$data = obj;

        this.$win = new BrowserWindow(this.$default_setting);
        this.$win.loadFile(this._ui);

        this._beforeOpen();

        setTimeout(() => {
            this.$win.showInactive(); // 显示但不聚焦于窗口（建议做延时处理）
        });

        this._afterOpen();
    };

    close() {
        if (!this.$win) {
            return;
        }

        this.$win.destroy();

        this.$win = null;
    };
}

var modalNotify = new ModalNotify();

module.exports = modalNotify;