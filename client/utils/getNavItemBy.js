const {nav} = require('../config/main.js');

module.exports = {
    url(path) {
        var path_url = new URL(path);

        var filtered = nav.filter(item => {
            let item_url = new URL(item.url);

            return path_url.pathname === item_url.pathname;
        })[0];

        if (filtered) {
            return filtered;
        }

        return false;
    },
}