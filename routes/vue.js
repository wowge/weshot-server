'use strict';
var mongoose = require('mongoose');
var Album = mongoose.model('Album');
var User = mongoose.model('User');
var passport = require('passport')

module.exports.album = function (req, res) {
  if (req.query && req.query.id){
    Album
      .findById(req.query.id)
      .exec(function (err, album) {
        if (!album){
          res.status(404);
          res.json({
            'message': 'No album found!'
          });
          return;
        }else if (err){
          res.status(404);
          res.json(err);
          return;
        }
        res.status(200);
        res.json(album);
      });
  }else {
    res.status(404);
    res.json({
      'message': 'No album id in req!'
    });
  }
};

module.exports.login = function (req, res) {
  if (!req.body.nickName || !req.body.password){
    res.status(400);
    res.json({
      msg: 'All fileds required'
    })
    return
  }
  passport.authenticate('local', function (err, user, info) {
    var token;
    if (err){
      res.status(404);
      res.json(err);
      return;
    }else if (user){
      token = user.generateJwt();
      res.status(201);
      res.json({
        token: token,
        user: user
      });
      return;
    }else {
      res.status(401);
      res.json(info)
    }
  })(req, res);
}