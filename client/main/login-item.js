// 程序自启动
const { app } = require('electron');
const store = require('./store.js');

const ex = process.execPath,
    SETTING_CONFIG = {
        args: [
            '--processStart',
            `"${ex}"`,
            '--process-start-args',
            `"--hidden"`,
        ],
    };

module.exports = {
    /**
     * 检查是否自启动
     * @returns 是否自启动
     */
    getState() {
        var res = app.getLoginItemSettings(SETTING_CONFIG);

        return res.openAtLogin;
    },

    /**
     * 设置自启动状态
     * @param {Boolean} openAtLogin 开启/关闭自启动
     * @returns
     */
    toggle(openAtLogin = true) {
        if (process.env.NODE_ENV === 'development') {
            // 开发环境
            return;
        }

        if (process.platform === 'win32') {
            app.setLoginItemSettings({
                ...SETTING_CONFIG,
                openAtLogin,
                openAsHidden: true,
            });
        }

        return this.getState();
    },

    /**
     * 进行且仅进行一次强制注册
     * @returns 是否强行注册完成
     */
    signForceOnce() {
        var regedLoginItem = store.get('regedLoginItem');

        if (regedLoginItem) {
            // 已强制注册过
            return false;
        }

        // 注册
        this.toggle(true);

        // 更新存储值
        store.set('regedLoginItem', true);

        return true;
    },
};
