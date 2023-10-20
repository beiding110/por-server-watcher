const { BrowserWindow } = require('electron');
const remote = require('@electron/remote/main');

const windowFeatures = require('../utils/windowFeatures');

const {bwUrl} = require('../config/main');

// const view = require('./view.js');

remote.initialize();

function MainWindow() {
    this.init();
}

MainWindow.prototype = {
    init() {
        this.$window = null;
        this.$webContents = null;

        this._onshow = null
    },

    /**
     * 创建window
     * @param {String} url window加载的地址
     * @param {Function} onshow 界面展示时的回调
     */
    create(url = bwUrl, onshow) {
        // Create the browser window.
        var wf = windowFeatures();

        wf.frame = false;

        this.$window = new BrowserWindow(wf);
        this.$webContents = this.$window.webContents;

        // and load the index.html of the app.
        this.$window.loadURL(url);

        // Open the DevTools.
        if (process.env.NODE_ENV === 'development') {
            this.$window.webContents.openDevTools();
        }

        remote.enable(this.$window.webContents);

        this._onshow = onshow;

        // this.createView();

        this.bindEvent();
    },

    /**
     * 绑定事件
     */
    bindEvent() {
        this.$window.on('maximize', () => {
            this.$window.webContents.send('maximize');
        });

        this.$window.on('unmaximize', () => {
            this.$window.webContents.send('unmaximize');
        });

        this.$window.once('ready-to-show', () => {
            if (this._onshow) {
                this._onshow();
            }

            this.$window.show();
        });
    },

    /**
     * 给当前window绑定view
     */
    createView() {
        view.create();

        view.mount(this.$window);
    },
}

module.exports = new MainWindow();