const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

// 自定义中间件
const ignoreFavicon = require('./middlewares/ignore-favicon');
const trunApiPrefix = require('./middlewares/trun-apiprefix');
const jwtVerify = require('./middlewares/jwt-verify');
const logger = require('./middlewares/logger');

const router = require('./router');
const { api_prefix, server_port, token_exUrl, token_exMethod } = require('../config');
require('./utils/db');
require('./utils/email');
require('./utils/redis');

const app = express();

app.use(morgan('dev'));     // 打印请求信息

app.use(bodyParser.urlencoded({ extended: false }));    // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                             // parse application/json

app.use(ignoreFavicon());                     // 忽略 favicon 请求
app.use(logger());                            // 打印参数
app.use(trunApiPrefix(api_prefix));           // 统一处理请求前缀
app.use(jwtVerify({                           // token 认证
  exUrl: token_exUrl, 
  exMethod: token_exMethod,
}));      

router(app);

app.listen(server_port, function () {
  console.log(`server is starting on port: ${server_port}.`)
});