const { Types } = require('mongoose');

const mongoose = require('../index.js');

var Schema = mongoose.Schema;

let data = {
    name: String,
    url: String,
    keys: String,

    state: Number, // 0未请求，1正常，2异常
    lasttime: String,
    speed: String,

    adduser: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    addtime: String,

    scbj: Number,
};

var dataSchema = Schema(data);

var Data = mongoose.model('watcher', dataSchema);

module.exports = Data;
