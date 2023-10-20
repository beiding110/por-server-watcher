var { Menu, Tray, BrowserWindow, app } = require('electron');
var path = require('path');
var {version, productName} = require('../package.json');
const bWindow = require('./window.js');
const loginItem = require('./login-item.js');

function IconTray() {
    this.init();
}

IconTray.prototype = {
    init() {
        this._icon_normal = path.join(__dirname, '../render/public/static/256.png');
        this._icon_transparent = path.join(__dirname, '../render/public/static/empty.png');

        // 创建拖盘
        this.$iconTray = new Tray(this._icon_normal);

        // 鼠标悬停托盘提示
        this.$iconTray.setToolTip(productName);

        this._shineTimer = null;

        this._bindMenu();
        this._bindEvent();
    },
    _bindMenu() {
        var loginItemState = loginItem.getState();

        // 配置右键菜单
        var trayMenu = Menu.buildFromTemplate([
            {
                label: `开机自动运行`,
                submenu: [
                    {
                        label: '是',
                        type: 'radio',
                        checked: loginItemState,
                        click: () => {
                            loginItem.toggle();
                        },
                    },
                    {
                        label: '否',
                        type: 'radio',
                        checked: !loginItemState,
                        click: () => {
                            loginItem.toggle(false);
                        },
                    },
                ],
            },
            // {
            //     label: `检查更新(${version})`,
            //     click: function () {
            //         const checkUpdate = require('./update.js');

            //         checkUpdate();
            //     },
            // },
            {
                type: 'separator',
            },
            {
                label: '退出',
                click: function () {
                    if (process.platform !== 'darwin') {
                        app.quit();
                    }
                },
            },
        ]);

        // 绑定右键菜单到托盘
        this.$iconTray.setContextMenu(trayMenu);
    },
    _bindEvent() {
        var win = bWindow.$window;
 
        // 点击关闭按钮让应用保存在托盘
        win.on('close', (e) => {
            if (!win.isFocused()) {
                win = null;
            } else {
                // 阻止窗口的关闭事件
                e.preventDefault();  
                win.hide();
            }
        });

        // 任务栏图标双击托盘打开应用
        this.$iconTray.on('double-click', () => {
            win.show();

            this.shineEnd();
        });
    },
    /**
     * 消息闪烁提示
     */
    shineStart() {
        var count = 0;

        this.shineEnd();

        this._shineTimer = setInterval(() => {
            count++;

            if (count % 2 == 0) {
                this.$iconTray.setImage(this._icon_normal);
            } else {
                this.$iconTray.setImage(this._icon_transparent);
            }
        }, 500);
    },
    /**
     * 停止消息闪烁提示
     */
    shineEnd() {
        try{
            clearInterval(this._shineTimer);
        } catch(e) {
            
        }

        this.$iconTray.setImage(this._icon_normal);
    },
    /**
     * 手动销毁
     */
    destroy() {
        this.shineEnd();

        this.$iconTray.destroy();
    },
}

var iconTray = new IconTray();

module.exports = iconTray;