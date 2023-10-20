const path = require('path');

var bwUrl = path.join(__dirname, '../render/dist/index.html');

if (process.env.NODE_ENV === 'development') {
    bwUrl =  `http://localhost:8080/#/home`;
}

module.exports = {
    bwUrl,
}