var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var mongoose = require('mongoose')
var User = mongoose.model('User')

passport.use(new LocalStrategy({
  usernameField: 'password'
}, function (username, password, done) {
  User.findOne({_id: password}, function (err, user) {
    if (err){
      return done(err)
    }else if (!user){
      return done(null, false, {
        msg: 'incorrect user'
      })
    }else if (!user.validPassword(password)){
      return done(null, false, {
        msg: 'incorrect password'
      })
    }
    return done(null, user)
  })
}))