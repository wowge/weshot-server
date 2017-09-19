var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var jwt = require('jsonwebtoken')

var userSchema = new Schema({
    _id: String,
    nickName: String,
    avatarUrl: String,
    albums: [{type: Schema.Types.ObjectId, ref: 'Album'}],
    history: [{type: Schema.Types.ObjectId, ref: 'Album'}],
}, {_id: false});

userSchema.methods.validPassword = function (password) {
  return this._id === password
}

userSchema.methods.generateJwt = function () {
  var expiry = new Date()
  expiry.setDate(expiry.getDate() + 7)
  console.log(process.env.JWT_SECRET)
  return jwt.sign({
    _id: this._id,
    exp: parseInt(expiry.getTime()/1000)
  }, process.env.JWT_SECRET)
}

mongoose.model('User', userSchema);