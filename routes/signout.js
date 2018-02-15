var express = require('express');
var router = express.Router();



router.get('/logout',function(req,res,next){
   req.session.user = null;
   res.send({"result":"success"});   
})

module.exports = router