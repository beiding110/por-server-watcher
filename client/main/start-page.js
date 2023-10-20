const { BrowserWindow } = require('electron');
const path = require('path');

class StartPage {
    constructor() {
        this.$win = null;
        this._ui = path.join(__dirname, '../html/start-page/index.html');
        this.$default_setting = {
            width: 500,
            height: 310,
            show: false,
            frame: false, // 无边框
            skipTaskbar: true, // 使窗口不显示在任务栏中
            movable: false, // 禁止窗口被用户移动
            resizable: false, // 禁止窗口手动调整窗口大小
            fullscreenable: false, // 禁止窗口可以进入全屏状态
        };
    }

    /**
     * 生成启动页面
     */
    create() {
        this.$win = new BrowserWindow(this.$default_setting);
        this.$win.loadFile(this._ui);

        this._bindEvents();
    }

    /**
     * 给启动页面绑定事件
     */
    _bindEvents() {
        this.$win.once('ready-to-show', () => {
            this.$win.showInactive();
        });
    }

    /**
     * 销毁启动页面
     * @returns Boolean
     */
    destroy() {
        if (!this.$win) {
            return false;
        }

        this.$win.destroy();

        this.$win = null;

        return true;
    }
}

module.exports = new StartPage();