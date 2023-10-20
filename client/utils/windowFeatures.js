const path = require('path');

module.exports = function() {
    return {
        width: 390,
        height: 844,
        minWidth: 390,
        minHeight: 844,
        icon: path.join(__dirname, '../render/public/favicon.ico'),
        show: false,
        backgroundColor: '#fff',
        webPreferences: {
            preload: path.join(__dirname, '../preload/window.js'),
            nodeIntegration: true,
            contextIsolation: false,
        },
    };
}