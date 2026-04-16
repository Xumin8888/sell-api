const mysql = require('mysql');

// 创建连接池（确保配置和你的MySQL一致）
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456', // 你的MySQL密码
  database: 'sell',   // 你的数据库名
  port: 3306,
  charset: 'utf8mb4'
});

// 正确封装query方法（避免callback类型错误）
exports.query = function(sql, params, callback) {
  // 处理参数省略的情况：如果第二个参数是函数，说明没传params
  if (typeof params === 'function') {
    callback = params;
    params = []; // 重置params为空数组
  }
  // 校验callback必须是函数
  if (typeof callback !== 'function') {
    console.error('错误：query方法必须传入回调函数');
    return;
  }
  // 从连接池获取连接并执行SQL
  pool.getConnection((err, connection) => {
    if (err) {
      callback(err); // 连接失败，执行回调
      return;
    }
    // 执行SQL查询
    connection.query(sql, params, (err, results) => {
      connection.release(); // 释放连接（关键，避免连接池耗尽）
      callback(err, results); // 执行回调，返回结果/错误
    });
  });
};