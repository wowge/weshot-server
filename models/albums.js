var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reviewSchema = new Schema({
    reviewText: String,
    userInfo: {
        open_id: String,
        nickName: String,
        avatarUrl: String,
    },
    createOn: {type: Date},
});
var albumSchema = new Schema({
    photos: {type: [String]},
    feelings: {type: [String]},
    albumName: {type: String},
    memory: {type: String},
    music: {
        poster: {type: String},
        name: {type: String},
        authors: {type: String},
        id: {type: String},
    },
    createOn: {type: Date},
    userInfo: {
        open_id: String,
        nickName: String,
        avatarUrl: String,
    },
    reviews: [reviewSchema],
});

mongoose.model('Album', albumSchema);