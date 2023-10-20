const resFrame = require('../utils/resFrame');

module.exports = function (req, res, next) {
    const getToken = req.query?._token,
        postToken = req.body?._token,
        cookieToken = req.cookie?._token;

    // 未登录
    if (!(getToken || postToken || cookieToken)) {
        var tdata = resFrame('login-index', '', '身份过期，请重新登录');

        res.send(tdata);

        return false;
    }

    next();
}