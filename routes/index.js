'use strict';

const express = require('express');
const router = express.Router();
const MusicApi = require('music-api');
const qiniu = require('qiniu');
const weshot = require('./weshot');

router.get('/', require('./welcome'));
router.get('/login', require('./login'));
router.get('/user', require('./user'));

router.post('/album/new', weshot.newAlbum);
router.get('/albumDetail', weshot.albumDetail);
router.get('/albumBrief', weshot.albumBrief);
router.get('/usr', weshot.usr);
/**
 * Music-api
 */

router.get('/api/search/song/:vendor', (req, res) => {
    let vendor = req.params.vendor;
    MusicApi.searchSong(vendor, req.query || {})
        .then(data => res.json(data))
        .catch(err => res.send(err))
});

router.get('/api/search/album/:vendor', (req, res) => {
    let vendor = req.params.vendor;
    MusicApi.searchAlbum(vendor, req.query || {})
        .then(data => res.json(data))
        .catch(err => res.send(err))
});

router.get('/api/search/playlist/:vendor', (req, res) => {
    let vendor = req.params.vendor;
    MusicApi.searchPlaylist(vendor, req.query || {})
        .then(data => res.json(data))
        .catch(err => res.send(err))
});

router.get('/api/get/song/:vendor', (req, res) => {
    let vendor = req.params.vendor;
    MusicApi.getSong(vendor, req.query || {})
        .then(data => res.json(data))
        .catch(err => res.send(err))
});

router.get('/api/get/album/:vendor', (req, res) => {
    let vendor = req.params.vendor;
    MusicApi.getAlbum(vendor, req.query || {})
        .then(data => res.json(data))
        .catch(err => res.send(err))
});

router.get('/api/get/playlist/:vendor', (req, res) => {
    let vendor = req.params.vendor;
    MusicApi.getPlaylist(vendor, req.query || {})
        .then(data => res.json(data))
        .catch(err => res.send(err))
});

router.get('/api/suggest/album/:vendor', (req, res) => {
    let limit = req.query.limit,
        raw = req.query.raw;
    let vendor = req.params.vendor;
    MusicApi.getSuggestAlbums(vendor, req.query || {})
        .then(data => res.json(data))
        .catch(err => res.send(err))
});

/**
 * qiniu cloud storage
 */

router.get('/api/uptoken', (req, res) => {
    var bucket = 'wowge';
    var putPolicy = new qiniu.rs.PutPolicy(bucket);
    var uptoken = putPolicy.token();
    res.json({
        uptoken: uptoken
    });
});

router.get('/api/downloadUrl', (req, res) => {
    var key = req.query.key;
    var url = 'https://orf9v7q1t.bkt.clouddn.com/' + key;
    var policy = new qiniu.rs.GetPolicy();
    var downloadUrl = policy.makeRequest(url);
    res.json({
        downloadUrl: downloadUrl
    });
});

module.exports = router;