const { ipcMain, BrowserWindow } = require('electron');

const bWindow = require('./window.js');
const showNotification = require('./notification.js');
const modelNotify = require('./modal-notify.js');

// 主界面触发，作用于view
// bWindow.$webContents.send('main-view', data);

// view触发，作用于主界面
ipcMain.on('view-main', (e, data) => {
    // bWindow.$webContents.send(data.name, data.data);
});

// 弹出Notification
ipcMain.on('notify', (e, data) => {
    showNotification(data);
});

// 弹出modalNotify
ipcMain.on('modalNotify', (e, data) => {
    modelNotify.open(data);
});

// 调试工具
ipcMain.on('dev-tools', (e, data) => {
    var win = BrowserWindow.getFocusedWindow();

    if (!win) {
        return;
    }

    win.webContents.openDevTools();
});
