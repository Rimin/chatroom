/**
 * 
 * 仿微信网页版的后台，纯后台,提供数据
 * 
 */


/***引入模块 ***/
var path = require('path')
var express = require('express');
var session = require('express-session');
var config = require('config-lite')(__dirname);
var routes = require('./routes/router')
var ejs = require('ejs') ;
var MongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');
var app = express();

//跨域设置（maybe isn't necessary）
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", null);
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS"); 
    next();
});

//设置session
app.use(session({
    name: config.session.key,
    secret: config.session.secret,
    resave:true,
    saveUninitialized:false,
    cookie:{
        maxAge: config.session.maxAge, 
    },
    store: new MongoStore({
        url: config.mongodb
    })
}))


//静态资源
app.use(express.static(path.join(__dirname, 'public')))
//app.use(express.static('public'));

//设置模板
//app.set('view engine', 'ejs')
//app.set('views', path.join(__dirname, 'view'))
app.engine('.html',ejs.__express) ; 
app.set('view engine', 'html');

//进入登录页
app.get('/',function(req,res){
    res.render('wechat');
})
//中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));   //貌似并没有用

//路由
routes(app);

//监听端口，启动程序
app.listen(3000,function(){
    console.log("服务器已启动...");
})

