var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

// 引入路由
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var goodsRouter = require('./routes/goods');
var orderRouter = require('./routes/order');
var shopRouter = require('./routes/shop');
var statsRouter = require('./routes/stats');
var articleRouter = require('./routes/article');
var activityRouter = require('./routes/activity');

var app = express();

// ✅ 1. 必须放在最前面，确保所有请求都能跨域
app.use(cors({
  origin: '*', // 开发阶段用*，上线后再改成你的域名 https://xumin8888.github.io
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ 2. 处理OPTIONS预检请求
app.options('*', cors());

// 模板引擎配置
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 通用中间件
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 挂载路由
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/goods', goodsRouter);
app.use('/order', orderRouter);
app.use('/shop', shopRouter);
app.use('/stats', statsRouter);
app.use('/article', articleRouter);
app.use('/activity', activityRouter);

// 404处理
app.use(function (req, res, next) {
  next(createError(404));
});

// 全局错误处理
app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({
    code: 1,
    msg: err.message || '服务器内部错误'
  });
});

module.exports = app;