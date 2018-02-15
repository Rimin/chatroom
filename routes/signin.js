//import { Error } from 'mongoose';

var express = require('express');
var router = express.Router();
var  User_Login_Model = require('../models/users_login');
var bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

router.post('/login',function(req,res,next){
    var acc = req.body.account,
       pasw = req.body.password;
    var errinfor = {
        "result":"failed",
        "reason":"用户名或密码不正确"
    }
    //简单的检验
    try{
        if(!name.length){
            throw new Error("haven't input your username");
        }
        if(!password.length){
            throw new Error("haven't input your password"); 
        }
    }catch(e){
       // console.log("error:fail to login");
    }

    //查找数据库
    var field = {"account":acc,"password":pasw};
    User_Login_Model.find(field,function(err,result){
      if(err) {
        errinfor = {
            "result":"failed",
            "reason":"服务器错误"
        }  
        res.json(errinfor);
      }
      else {
        if(result.length==0){  //查询不到，说明数据库无匹配项
            res.json(errinfor);
        }
        else{//查询成功
            //将用户信息写入session
            delete result[0].password; 
            req.session.user = result[0];
            //返回数据
            res.json({"result":"success","userid":result[0]._id});
        }
      }
    })
})


module.exports = router

