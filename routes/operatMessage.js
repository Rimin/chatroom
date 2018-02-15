var express = require('express');
var router = express.Router();
var  Message_Model = require('../models/messages');
var checkLogin = require('../lib/check').checkLogin;
var bodyParser = require('body-parser');
var moment = require('moment');


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

router.post('/sendContent',checkLogin,function(req,res,next){
   var data = {
       "sender":req.session.user._id,
       "receiver":req.body.receiver,
       "content":req.body.content,
       "date": moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
       "state":0
   }
   var insert = new  Message_Model(data);
   insert.save(function(err){
       if(err){
           res.send({"result":"failed","reason":"服务器错误"});
       }
       else{
           res.send({"result":"success"});
       }
   })
})

router.get('/getUnreadChatRecord',checkLogin,function(req,res,next){
    var id = req.session.user._id,
        field = {"receiver":id,"state":0};

    Message_Model.find(field,function(err,messages){
        if(err){
             res.send({"result":"failed","reason":"服务器错误"});
            // console.log(err);
         }
        else{       
         //改变状态为1
          if(messages.length!=0){
            for(var i=0;i<messages.length;i++){
                messages[i].state = 1;
                messages[i].save();
            }     
          }
          res.send(messages); 
        }
    })
})


router.get('/getChatRecord',checkLogin,function(req,res,next){
    var myid = req.session.user._id,
       otherid = req.query.id,
       field = {"sender":{'$in':[myid,otherid]},"receiver":{'$in':[myid,otherid]}};
    Message_Model.find(field,function(err,messages){
        if(err){ res.send({"result":"failed","reason":"服务器错误"}); }
        res.send(messages);
    })
})

module.exports = router