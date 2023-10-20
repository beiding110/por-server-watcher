// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu } = require('electron');

const windowFeatures = require('./utils/windowFeatures');

const bWindow = require('./main/window.js');
const startPage = require('./main/start-page.js');

app.commandLine.appendSwitch('force_high_performance_gpu');
// app.disableHardwareAcceleration();

Menu.setApplicationMenu(null);

const gotTheLock = app.requestSingleInstanceLock();

if (process.platform === 'win32'){
    // 避免弹窗提示时展示非app名称；
    app.setAppUserModelId(app.name);
}

if (!gotTheLock) {
    // 第二次被打开的程序
    app.quit();

    return;
} else {
    app.on('second-instance', (event, commandLine, workingDirectory, additionalData) => {
        // 输出从第二个实例中接收到的数据
        console.log(additionalData);

        // 有人试图运行第二个实例，我们应该关注我们的窗口
        if (bWindow.$window) {
            if (bWindow.$window.isMinimized()) {
                bWindow.$window.restore();
            } else {
                bWindow.$window.show();
            };
            
            bWindow.$window.focus();
        }
    });

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.whenReady().then(() => {
        // 创建启动页
        startPage.create();

        // 创建主界面
        bWindow.create(undefined, () => {
            //主界面显示时，关闭启动页
            startPage.destroy();
        });

        // 强制注册一次开机自启
        const loginItem = require('./main/login-item.js');

        loginItem.signForceOnce();

        // 任务栏图标
        require('./main/tray.js');

        // ipc
        require('./main/ipc.js');

        // 自动更新
        // const checkUpdate = require('./main/update.js');

        // checkUpdate(true);

        app.on('activate', function () {
            // On macOS it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (BrowserWindow.getAllWindows().length === 0) bWindow.create();
        });

        app.on('web-contents-created', (createEvent, contents) => {
            contents.setWindowOpenHandler(({ url }) => {
                var wf = windowFeatures();

                return {
                    action: 'allow',
                    overrideBrowserWindowOptions: wf,
                };
            });
        });
    });
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.

// app.on('window-all-closed', function () {
//   if (process.platform !== 'darwin') app.quit()
// })

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.