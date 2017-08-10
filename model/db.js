const mongoose = require('mongoose');
const config = require('config-lite')(__dirname);
const db = mongoose.createConnection(config.dbURL)
//对外暴露db，让user.js调用和ablums调用，使得用户操作数据库和相册获取数据库数据分开
module.exports = db;


