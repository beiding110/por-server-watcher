const { autoUpdater } = require('electron-updater');
const { dialog } = require('electron');
const showNotify = require('./notification.js');
const iconTray = require('./tray.js');
var {version, productName} = require('../package.json');

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

if (IS_DEVELOPMENT) {
    // 测试环境调试更新版本
    const { app, } = require('electron');
    const path = require('path');

    autoUpdater.updateConfigPath = path.join(__dirname, '../dev-app-update.yml');

    // 防止报错no such file or directory dev-app-update.yml
    Object.defineProperty(app, 'isPackaged', {
        get() {
            return true;
        },
    });
}

var _isAutoCheck = true; // 是否为进入系统后自动检测，true的时候，无更新不提示

//设置自动下载
autoUpdater.autoDownload = false;

autoUpdater.on('error', (res) => {
    console.log('error:' + res);

    showNotify({
        title: 'error',
        content: JSON.stringify(res)
    });

    // dialog
    //     .showMessageBox({
    //         message: `error:${res}`
    //     })
});

autoUpdater.on('checking-for-update', (res) => {
    console.log('checking-for-update:' + JSON.stringify(res));
});

autoUpdater.on('update-not-available', (res) => {
    console.log('update-not-available:' + JSON.stringify(res));

    if (!_isAutoCheck) {
        // _isAutoCheck 为 false，提示
        dialog
            .showMessageBox({
                type: 'info',
                title: '您使用的是最新版本',
                message: `${productName} ${version} 是当前最新版本`,
            });

        _isAutoCheck = true;
    }

    // dialog
    //     .showMessageBox({
    //         message: `update-not-available:${JSON.stringify(res)}`
    //     })
});

autoUpdater.on('update-available', (res) => {
    dialog
        .showMessageBox({
            type: 'info',
            title: '发现新的版本',
            message: `发现新版本${res.version}, 马上更新?`,
            buttons: ['确定', '取消'],
        })
        .then((resp) => {
            if (resp.response == 0) {
                autoUpdater.downloadUpdate();

                showNotify({
                    title: '下载中',
                    content: '更新内容下载中，请稍后'
                });
            }
        });
});

autoUpdater.on('download-progress', (res) => {
    console.log('download-progress:' + JSON.stringify(res));
});

autoUpdater.on('update-downloaded', () => {
    dialog
        .showMessageBox({
            title: '下载完成',
            message: '最新版本已下载完成, 退出程序进行安装',
        })
        .then(() => {
            iconTray.destroy();
            autoUpdater.quitAndInstall();
        });
});

/**
 * 检测更新
 * @param {Boolean} isAutoCheck 是否为自动检测，是的话则无更新时不提示
 */
module.exports = function (isAutoCheck = false) {
    _isAutoCheck = isAutoCheck;

    // 检测是否有新版本
    autoUpdater.checkForUpdates();
};
