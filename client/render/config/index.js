module.exports = {
    devServer: {
        port: '8080',
        open: true,
        // proxy: {
        //     '/watcher': {
        //         target: `http://127.0.0.1:3001`,
        //         changeOrigin: true,
        //         pathRewrite: {
        //             '^/watcher': '/',
        //         },
        //     },
        // },
    },
};
