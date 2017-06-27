var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var playlistSchema = new Schema({
    openId: String,
    lists: [{
        name: String,
        id: String
    }]
});

mongoose.model('Playlist', playlistSchema);