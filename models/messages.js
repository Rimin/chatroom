var mongoose = require('../mongodb/mongodb.js');

var Schema = mongoose.Schema;

var message = new Schema({
    sender:{ type:String, required: true},
    receiver:{ type:String, required: true},
    content:{ type:String, required: true},
    date:{type:String},
    state:{type:Number}
})

var Message = mongoose.model('Message',message,'message');
module.exports = Message;