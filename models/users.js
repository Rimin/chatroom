var mongoose = require('../mongodb/mongodb.js');

var Schema = mongoose.Schema;

var user = new Schema({
    _id:{type:String},
    nickname:{ type:String, required: true},
    address:{ type:String, required: true},
    mailbox:{ type:String, required: true},
    age:{type:Number},
    introduction:{type:String},
    friend:[{
        _id:String,
        nickname:String
    }]
})

var User = mongoose.model('User',user,'user');
module.exports = User;