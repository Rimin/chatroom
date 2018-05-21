var express = require('express');
var router = express.Router();
var User_Model = require('../models/users');
var bodyParser = require('body-parser');
//为了使用户名修改后两个表的用户名相同
var  User_Login_Model = require('../models/users_login');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));


//获取个人信息
router.get('/getUserInfor',function(req,res,next){
    var id  = req.query.id;  
    var field = {"_id":id};
    User_Model.find(field,function(err,user){
        if(err){
             res.json({"result":"failed","reason":"服务器错误"});
        }
        else{
            //查询成功
          
            if(user.length==0){res.json({"result":"failed","reason":"找不到此人的信息"});}
            else{
                res.json(user[0]);
            }
        }
    })
})

router.get('/getList',function(req,res,next){
    var id  = req.session.user._id;
    var field = {"_id":id};
    User_Model.find(field,function(err,user){
        if(err){
             res.json({"result":"failed","reason":"服务器错误"});
        }
        else{
            //查询成功
          
            if(user.length==0){res.json({"result":"failed","reason":"找不到此人的信息"});}
            else{
                res.json(user[0].friend);
            }
        }
    })
})

//修改个人信息
router.post('/updateUserInfor',function(req,res,next){
    var id = req.session.user._id,
        field = {"_id":id},
        nickname = req.body.nickname;
        newData = {
            "nickname":nickname,
            "age":req.body.age,
            "address":req.body.address,
            "introduction":req.body.introduction,
            "mailbox":req.body.mailbox
         } 
    User_Model.update(field,newData,function(err,result){
         if(err){
            res.send({ "result":"failed", "reason":"服务器错误"});
         }
         else{
            // console.log(result);//{ n: 1, nModified: 1, ok: 1 }
            User_Model.find({"friend":{$exists: true}},function(err,user){
                if(err){res.send({ "result":"failed", "reason":"服务器错误"});}
                for(var j=0;j<user.length;j++){
                for(var i=0;i<user[j].friend.length;i++){
                if(user[j].friend[i]._id==id){
                user[j].friend[i].nickname = nickname;
                user[j].save(function(err,doc){
                console.log("test")
                if(err){
                console.log(err); 
                 res.send({ "result":"failed", "reason":"服务器错误"});
                }
                //  res.send({"result":"success"});
              }) 
             }
            }
           }
           User_Login_Model.update(field,{"account":req.body.nickname},function(err,result){
            if(err){
            res.send({ "result":"failed", "reason":"服务器错误"});
            } 
            else{
                res.send({"result":"success"});
            }
          }) 

        }) 
           
       }
    })

  
})

module.exports = router