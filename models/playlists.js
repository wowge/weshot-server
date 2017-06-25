var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var playlistSchema = new Schema({
    name: String,
    playlist: [{
        poster: String,
        name: String,
        authors: String,
        src: String,
        id: String,
    }],
});

mongoose.model('Playlist', playlistSchema);