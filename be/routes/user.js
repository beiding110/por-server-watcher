var express = require('express');
var router = express.Router();

const resFrame = require('../utils/resFrame');

const User = require('../db/schema/user');

/* GET users listing. */
router.get('/', function (req, res, next) {
    const query = req.query;

    res.send('respond with a resource');
});

router.post('/login', async function (req, res, next) {
    var tdata;

    try {
        const body = req.body,
            {loginname, pwd} = body;

        if (!loginname || !pwd) {
            tdata = resFrame('error', '', '用户名密码不能为空');

            res.send(tdata);

            return false;
        }

        var data = await User.findOne({
            loginname,
        });

        if (!data) {
            tdata = resFrame('error', '', '该用户不存在');
            res.send(tdata);
            return false;
        }
    
        if (data.pwd !== pwd) {
            tdata = resFrame('error', '', '用户名或密码错误');
            res.send(tdata);
            return false;
        }
    
        data.pwd = '';

        res.cookie('watcher_userid', data.id, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
        });

        tdata = resFrame(data);
        res.send(tdata)
    } catch(e) {
        tdata = resFrame('error', '', e);
        res.send(tdata);
    }
});

router.get('/info', async function (req, res, next) {
    var tdata;

    try {
        const {_token} = req.query;

        if (!_token) {
            tdata = resFrame('error', '', '请先登录');
            res.send(tdata);
            return false;
        }

        var data = await User.findById(_token);

        data.pwd = '';

        tdata = resFrame(data);
        res.send(tdata)
    } catch(e) {
        tdata = resFrame('error', '', e);
        res.send(tdata);
    }
});

module.exports = router;
