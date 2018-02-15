var mongoose = require('mongoose');
//var DB_CONN_STR = 'mongodb://localhost:27017/wechat';
mongoose.Promise = global.Promise; 
mongoose.connect('mongodb://localhost:27017/wechat',{useMongoClient:true});
 module.exports = mongoose;