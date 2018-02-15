module.exports = function (app) {
   app.post('/login', require('./signin'));
   app.use('/',require('./operatInfor'));
   app.get('/logout',require('./signout'));
   app.use('/',require('./operatMessage'))
  }
  