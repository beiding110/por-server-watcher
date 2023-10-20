const util = require('./util.js');
const webpack = require('webpack');
const path = require('path');

var baseConfig = {
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
    assetsDir: 'static',
    lintOnSave: false,
    chainWebpack: (config) => {
        util.forEachKey(
            {
                vue$: 'vue/dist/vue.esm.js',
                '@': util.resolve('src'),
                '@assets': util.resolve('src/assets'),
                '@components': util.resolve('src/components'),
                '@components-sys': util.resolve('src/components-sys'),
                '@config': util.resolve('src/config'),
                '@css': util.resolve('src/css'),
                '@js': util.resolve('src/js'),
                '@layout': util.resolve('src/layout'),
                '@mixins': util.resolve('src/mixins'),
                '@router': util.resolve('src/router'),
                '@store': util.resolve('src/store'),
                '@views': util.resolve('src/views'),
            },
            function (key, value) {
                config.resolve.alias.set(key, value);
            }
        );

        config.plugin('provide').use(webpack.ProvidePlugin, [
            {
                $: 'jquery',
                jquery: 'jquery',
                jQuery: 'jquery',
                'window.jQuery': 'jquery',
            },
        ]);
    },
    css: {
        loaderOptions: {
            sass: {
                implementation: require('sass'),
            },
        },
    },
};

module.exports = baseConfig;
