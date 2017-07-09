'use strict';
var mongoose = require('mongoose');
var Album = mongoose.model('Album');
var User = mongoose.model('User');
var Playlist = mongoose.model('Playlist');

const LoginService = require('qcloud-weapp-server-sdk').LoginService;
const qiniu = require('qiniu');

/**
 * Insert, delete or get photos' info and reviews.
 */

module.exports.newAlbum = function (req, res) {
    const loginService = LoginService.create(req, res);

    loginService.check()
        .then(data => {
            var userInfo = {
                open_id: data.userInfo.openId,
                nickName: data.userInfo.nickName,
                avatarUrl: data.userInfo.avatarUrl,
            };
            Album.create({
                albumName: req.body.albumName,
                memory: req.body.memory,
                photos: req.body.photos,
                feelings: req.body.feelings,
                music: req.body.music,
                createOn: req.body.createOn,
                userInfo: userInfo,
            }, function (err, album) {
                if (err){
                    res.status(400);
                    res.json(err);
                }else {
                    User
                        .findById(album.userInfo.open_id)
                        .exec(function (err, user) {
                            if (!user){
                                User.create({
                                    _id: album.userInfo.open_id,
                                    nickName: album.userInfo.nickName,
                                    avatarUrl: album.userInfo.avatarUrl,
                                    albums: [album._id],
                                }, function (err, user) {
                                    if(err){
                                        res.status(400);
                                        res.json(err);
                                    }
                                });
                                return;
                            }else if (err){
                                res.status(400);
                                res.json(err);
                                return;
                            }
                            user.nickName = album.userInfo.nickName;
                            user.avatarUrl = album.userInfo.avatarUrl;
                            user.albums.unshift(album._id);
                            user.save(function (err, usr) {
                                if (err){
                                    res.status(400);
                                    res.json(err);
                                }else {
                                    res.status(201);
                                    res.json(album);
                                }
                            });
                        });
                }
            });
        });
};

module.exports.albumDetail = function (req, res) {
    const loginService = LoginService.create(req, res);
    loginService
        .check()
        .then(data => {
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
                        User
                            .findById(data.userInfo.openId)
                            .select('-albums')
                            .exec(function (err, user) {
                                if (!user){
                                    User.create({
                                        _id: data.userInfo.openId,
                                        nickName: data.userInfo.nickName,
                                        avatarUrl: data.userInfo.avatarUrl,
                                        history: [album._id],
                                    }, function (err, user) {
                                        if(err){
                                            res.status(400);
                                            res.json(err);
                                        }
                                    });
                                    return;
                                }else if (err){
                                    res.status(400);
                                    res.json(err);
                                    return;
                                }
                                for (let i = 0, len = user.history.length; i < len; i++){
                                    if (user.history[i].equals(album._id)){
                                        user.history.splice(i, 1);
                                        break;
                                    }
                                }
                                user.nickName = data.userInfo.nickName;
                                user.avatarUrl = data.userInfo.avatarUrl;
                                user.history.unshift(album._id);
                                user.save(function (err, usr) {
                                    if (err){
                                        res.status(400);
                                        res.json(err);
                                    }else {
                                        res.status(200);
                                        res.json(album);
                                    }
                                });
                            });
                    });
            }else {
                res.status(404);
                res.json({
                    'message': 'No album id in req!'
                });
            }
        });
};

module.exports.usr = function (req, res) {
    const loginService = LoginService.create(req, res);
    loginService
        .check()
        .then(data => {
            if (req.query && req.query.id){
                User
                    .findById(req.query.id)
                    .exec(function (err, user) {
                        if (!user){
                            res.status(404);
                            res.json({
                                'message': 'User not found!'
                            });
                            return;
                        }else if (err){
                            res.status(404);
                            res.json(err);
                            return;
                        }
                        res.status(200);
                        res.json(user);
                    });
            }else {
                res.status(404);
                res.json({
                    'message': 'Usr id is required!'
                });
            }
        });
};

module.exports.albumBrief = function (req, res) {
    const loginService = LoginService.create(req, res);
    loginService
        .check()
        .then(data => {
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
        });
};

module.exports.albumDelete = function (req, res) {
    const loginService = LoginService.create(req, res);
    loginService
        .check()
        .then(data => {
            if (req.body && req.body.id){
                Album
                    .findById(req.body.id)
                    .exec(function (err, album) {
                        if (err){
                            res.status(400);
                            res.json(err);
                        }else {
                            for (let i = 0, len = album.photos.length; i < len; i++){
                                //构建bucketmanager对象
                                let client = new qiniu.rs.Client();
                                //你要测试的空间， 并且这个key在你空间中存在
                                let bucket = 'weshotprivate';
                                let key = album.photos[i];
                                //删除资源
                                client.remove(bucket, key, function(err, ret) {
                                    if (!err) {
                                    } else {
                                    }
                                });
                            }

                            Album
                                .findByIdAndRemove(req.body.id)
                                .exec(function (err, album) {
                                    if (err){
                                        res.status(400);
                                        res.json(err);
                                    }else {
                                        User
                                            .findById(data.userInfo.openId)
                                            .exec(function (err, user) {
                                                if (err){
                                                    res.status(400);
                                                    res.json(err);
                                                    return;
                                                }
                                                user.nickName = data.userInfo.nickName;
                                                user.avatarUrl = data.userInfo.avatarUrl;
                                                for (let i = 0, len = user.albums.length; i < len; i++){
                                                    if (user.albums[i].equals(req.body.id)){
                                                        user.albums.splice(i, 1);
                                                        break;
                                                    }
                                                }
                                                user.save(function (err, usr) {
                                                    if (err){
                                                        res.status(400);
                                                        res.json(err);
                                                    }else {
                                                        res.status(204);
                                                        res.json(null);
                                                    }
                                                });
                                            });
                                    }
                                });
                        }
                    });
            }else {
                res.status(404);
                res.json('No album id in req!');
            }
        });
};

module.exports.historyDelete = function (req, res) {
    const loginService = LoginService.create(req, res);
    loginService
        .check()
        .then(data => {
            if (req.body && req.body.id){
                User
                    .findById(data.userInfo.openId)
                    .exec(function (err, user) {
                        if (err){
                            res.status(400);
                            res.json(err);
                            return;
                        }
                        user.nickName = data.userInfo.nickName;
                        user.avatarUrl = data.userInfo.avatarUrl;
                        for (let i = 0, len = user.history.length; i < len; i++){
                            if (user.history[i].equals(req.body.id)){
                                user.history.splice(i, 1);
                                break;
                            }
                        }
                        user.save(function (err, usr) {
                            if (err){
                                res.status(400);
                                res.json(err);
                            }else {
                                res.status(204);
                                res.json(null);
                            }
                        });
                    });
            }else {
                res.status(404);
                res.json('No history id in req!');
            }
        });
};

module.exports.playlist = function (req, res) {
    Playlist
        .find({catagory: req.query.catagory})
        .exec(function (err, playlist) {
            if (!playlist){
                res.status(404);
                res.json({
                    'message': 'No playlist found!'
                });
                return;
            }else if (err){
                res.status(404);
                res.json(err);
                return;
            }
            res.status(200);
            res.json(playlist);
        });
};