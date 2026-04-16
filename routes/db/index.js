// 数据库连接配置（核心：解决中文插入、连接问题）
const mysql = require('mysql');

// 创建连接池（替换成你的数据库账号密码）
const pool = mysql.createPool({
  host: 'localhost',        // 数据库地址（本地默认localhost）
  user: 'root',             // 数据库用户名
  password: '123456', // MySQL密码
  database: 'sell',         // 你的数据库名
  port: 3306,               // MySQL端口（默认3306）
  charset: 'utf8mb4'        // 解决中文插入1366错误
});

// 封装通用查询方法（兼容回调，统一释放连接）
exports.query = function(sql, params, callback) {
  // 处理参数省略情况（比如只传sql和callback）
  if (typeof params === 'function') {
    callback = params;
    params = [];
  }

  // 从连接池获取连接
  pool.getConnection((err, connection) => {
    if (err) {
      callback(err);
      return;
    }

    // 强制设置连接编码（兜底解决中文问题）
    connection.query('SET NAMES utf8mb4', (err) => {
      if (err) console.log('编码设置失败:', err);
    });

    // 执行SQL查询
    connection.query(sql, params, (err, results) => {
      connection.release(); // 释放连接（必须！否则连接池会耗尽）
      callback(err, results);
    });
  });
};