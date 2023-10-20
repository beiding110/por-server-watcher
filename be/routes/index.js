module.exports = function (app) {
    app.use('/user', require('./user'));
    app.use('/watcher', require('./watcher'));

    return app;
};