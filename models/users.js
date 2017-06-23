var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    _id: String,
    nickName: String,
    avatarUrl: String,
    albums: [{type: Schema.Types.ObjectId, ref: 'Album'}],
    history: [{type: Schema.Types.ObjectId, ref: 'Album'}],
}, {_id: false});

mongoose.model('User', userSchema);