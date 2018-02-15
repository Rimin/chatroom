var mongoose = require('../mongodb/mongodb.js');

var Schema = mongoose.Schema;

var user_login = new Schema({
    _id:{type:String,ref:'user'},
    account:{ type:String, required: true},
    password:{ type:String, required: true},
})

/*user_login.methods.getUserByName = function (name,callback){
    
}*/


var User_Login = mongoose.model('User_Login',user_login,'user_login');
module.exports = User_Login;