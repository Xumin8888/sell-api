const cors = require('cors')
app.use(cors()) // 允许所有跨域请求
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// 引入已有的路由
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var goodsRouter = require('./routes/goods');
var orderRouter = require('./routes/order');
var shopRouter = require('./routes/shop');
var statsRouter = require('./routes/stats');
var articleRouter = require('./routes/article');

// 引入活动接口路由
var activityRouter = require('./routes/activity');

var app = express();

// 核心：修复跨域配置（支持POST/DELETE/OPTIONS）
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  // 拦截OPTIONS预检请求，直接返回200
  if (req.method.toLowerCase() === 'options') {
    return res.sendStatus(200);
  }
  next();
});

// 模板引擎配置（保留）
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 通用中间件
app.use(logger('dev'));
app.use(express.json()); // 解析JSON请求体
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
// 活动接口挂载到/activity前缀
app.use('/activity', activityRouter);

// 404处理（返回JSON，适配接口）
app.use(function (req, res, next) {
  next(createError(404));
});

// 全局错误处理
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // 404返回JSON
  if (err.status === 404) {
    return res.status(404).json({
      code: 1,
      msg: '接口不存在：' + req.originalUrl
    });
  }
  
  // 500错误返回JSON
  res.status(err.status || 500).json({
    code: 1,
    msg: '服务器内部错误：' + err.message
  });
});

// ==========================================
// ✅ 唯一修改：端口适配 Vercel（这行是关键！）
// ==========================================
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log('✅ 服务器启动成功：访问地址 http://127.0.0.1:' + PORT);
});

module.exports = app;