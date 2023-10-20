const Store = require('electron-store');

const store = new Store({
    schema: {
        // 是否已自动注册过开机自启
        regedLoginItem: {
            type: 'boolean',
            default: false,
        },
    },
});

module.exports = store;
