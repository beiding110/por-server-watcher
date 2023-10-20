const mongoose = require('../index.js');

var Schema = mongoose.Schema;

let data = {
    loginname: String,
    pwd: String,
    truename: String,
    addtime: String,
};

var dataSchema = Schema(data);

var Data = mongoose.model('user', dataSchema);

module.exports = Data;
