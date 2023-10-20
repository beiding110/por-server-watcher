const {  BrowserView, screen, } = require('electron');
const path = require('path');

const windowFeatures = require('../utils/windowFeatures.js');
const getNavItemBy = require('../utils/getNavItemBy.js');

const {nav} = require('../config/main.js');

const viewSetting = {
    frame: false,
    hasShadow: false,
    useContentSize: true,
    webPreferences: {
        preload: path.join(__dirname, '../preload/view.js'),
    },
};

const headHeight = 60;

const boundsSetting = {
    x: 0,
    y: headHeight,
    width: 1220,
    height: 800 - headHeight,
};

function View (obj) {
    this.init(obj);
}

View.prototype = {
    init(obj) {
        this.$settings = obj;
        
        this.$view = null;
        this.$webContents = null;
        this.$win = null;
    },
    create() {
        var view = new BrowserView(viewSetting);

        view.setBounds(boundsSetting);

        view.setAutoResize({
            width: true,
            height: true,
        });

        view.webContents.loadURL(this.$settings[0].url);

        this.$view = view;
        this.$webContents = view.webContents;

        view.webContents.setWindowOpenHandler(({url}) => {
            var wf = windowFeatures();

            return {
                action: 'allow',
                overrideBrowserWindowOptions: wf,
            }
        });

        if (process.env.NODE_ENV === "development") {
            view.webContents.openDevTools();
        }
    },
    mount(win) {
        this.$win = win;

        win.setBrowserView(this.$view);

        this.$view.webContents.on('did-navigate', (e, url) => {
            var navItem = getNavItemBy.url(url);
    
            if (navItem) {
                win.webContents.send('nav-done', navItem);
            }
        });

        // 全屏时，view的自动大小会超过范围
        const mainScreen = screen.getPrimaryDisplay();

        win.on('resize', () => {
            this.$view.setBounds({
                ...boundsSetting, 
                width: win.getBounds().width, 
                height: win.getBounds().height - headHeight,
            });

            if(win.isMaximized() || win.isFullScreen()){
                win.setSize(mainScreen.workArea.width, mainScreen.workArea.height);

                this.$view.setBounds({
                    ...boundsSetting,
                    width: mainScreen.workArea.width, 
                    height: mainScreen.workArea.height - headHeight,
                })
            }
        });
    },
    shift(obj) {
        var id = obj.id,
            url = obj.url,
            query = obj.query,
            hash = obj.hash;

        var path;

        if (id) {
            var mapped = this.$settings.filter(item => item.id === id)[0];

            path = mapped.url;
        } else if (url) {
            path = url;
        }

        var search = '';

        if (query) {
            search = /\?/.test(path) ? '' : '?';

            Object.keys(query).forEach(key => {
                search += `${key}=${query[key]}`;
            });
        }

        var point = '';

        if (hash) {
            point = /\#/.test(path) ? '' : '#';

            point += hash;
        }

        this.$view.webContents.loadURL(`${path}${point}${search}`);
    },
};

module.exports = new View(nav);