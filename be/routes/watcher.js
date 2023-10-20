var express = require('express');
var router = express.Router();

const resFrame = require('../utils/resFrame');
const app = require('../utils/app');

const Watcher = require('../db/schema/watcher');

const isLogin = require('../middleware/is-login');
router.use(isLogin);

router.get('/list', async function (req, res, next) {
    var tdata;

    try {
        const { _token } = req.query;

        var data = await Watcher.find({
            adduser: _token,
            scbj: {
                $ne: 1,
            },
        });

        tdata = resFrame(data);
        res.send(tdata);
    } catch (e) {
        tdata = resFrame('error', '', e);
        res.send(tdata);
    }
});

router.post('/add', async function (req, res, next) {
    var tdata;

    try {
        const { _token, _id } = req.body,
            form = req.body;

        var data;

        if (_id) {
            // 编辑

            await Watcher.findByIdAndUpdate(form._id, form);

            data = await Watcher.findById(_id);
        } else {
            // 添加

            form.adduser = _token;
            form.addtime = app.getTime();
            form.state = 0;
            form.speed = 0;

            data = await Watcher.create(form);
        }

        tdata = resFrame(data);
        res.send(tdata);
    } catch (e) {
        tdata = resFrame('error', '', e);
        res.send(tdata);
    }
});

router.get('/detail', async function (req, res, next) {
    var tdata;

    try {
        const { _id } = req.query;

        if (!_id) {
            throw new Error('请指定id');
        }

        var data;

        data = await Watcher.findById(_id);

        tdata = resFrame(data);
        res.send(tdata);
    } catch (e) {
        tdata = resFrame('error', '', e);
        res.send(tdata);
    }
});

router.post('/del', async function (req, res, next) {
    var tdata;

    try {
        const { _id } = req.body;

        var data = await Watcher.findByIdAndUpdate(_id, {
            scbj: 1,
        });

        tdata = resFrame(data);
        res.send(tdata);
    } catch (e) {
        tdata = resFrame('error', '', e);
        res.send(tdata);
    }
});

module.exports = router;
