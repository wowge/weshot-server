var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var playlistSchema = new Schema({
    catagory: String,
    lists: [{
        name: String,
        id: String
    }]
});

mongoose.model('Playlist', playlistSchema);