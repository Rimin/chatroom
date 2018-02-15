module.exports = {
    checkLogin: function checkLogin (req, res, next) {
      if (!req.session.user) {
    
        return res.send({"result":"failed","reason":"未登录或网络连接断开"}); //若离线，则使页面重新刷新
      }
      next()
    },
  }