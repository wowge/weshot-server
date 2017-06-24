'use strict';

require('./globals');
require('./setup-qcloud-sdk');
require('./models/db');
const qiniu = require('qiniu');
qiniu.conf.ACCESS_KEY = process.env.qiniu_AK;
qiniu.conf.SECRET_KEY = process.env.qiniu_SK;

const https = require('https');
const http = require('http');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const config = require('./config');
const compression = require('compression');
const cors = require('cors');

const app = express();

app.set('query parser', 'simple');
app.set('case sensitive routing', true);
app.set('jsonp callback name', 'callback');
app.set('strict routing', true);
app.set('trust proxy', true);

app.disable('x-powered-by');

// music-api
app.use(cors());

// music-api gzip
app.use(compression());

// 记录请求日志
app.use(morgan('tiny'));

// parse `application/x-www-form-urlencoded`
app.use(bodyParser.urlencoded({ extended: true }));

// parse `application/json`
app.use(bodyParser.json());

app.use('/', require('./routes'));

// 打印异常日志
process.on('uncaughtException', error => {
    console.log(error);
});

// 启动server
http.createServer(app).listen(config.port, () => {
    console.log('Express server listening on port: ', config.port);
});
