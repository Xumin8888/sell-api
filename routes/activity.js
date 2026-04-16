var express = require('express');
var router = express.Router();
const db = require('./db/conn.js'); // 确认conn.js存在且配置正确

// 1. 活动列表接口（查询数据库数据）
router.get('/list', function(req, res, next) {
  // 执行SQL查询activity表所有数据
  const sql = 'SELECT * FROM activity';
  db.query(sql, (err, results) => {
    if (err) {
      // 查询失败返回错误信息
      return res.send({ 
        code: 1, 
        msg: '列表查询失败：' + err.message,
        data: []
      });
    }
    // 查询成功返回数据库中的真实数据
    res.send({ 
      code: 0, 
      msg: '列表接口成功',
      data: results // 这里是数据库查出来的真实数据，不再是空数组
    });
  }); 
});

// 2. 新增活动接口（插入数据到数据库）
router.post('/add', function(req, res, next) {
  // 获取前端传过来的参数（title/type/start_time等）
  const { title, type, start_time, end_time, state, content } = req.body;
  // 校验必填参数
  if (!title || !type || !start_time || !end_time || state === undefined) {
    return res.send({ 
      code: 1, 
      msg: '新增失败：标题/类型/开始时间/结束时间/状态为必填项' 
    });
  }
  // 插入数据的SQL
  const sql = 'INSERT INTO activity (title, type, start_time, end_time, state, content) VALUES (?, ?, ?, ?, ?, ?)';
  const params = [title, type, start_time, end_time, state, content || ''];
  db.query(sql, params, (err, results) => {
    if (err) {
      return res.send({ 
        code: 1, 
        msg: '新增失败：' + err.message 
      });
    }
    res.send({ 
      code: 0, 
      msg: '新增接口成功',
      data: { id: results.insertId } // 返回新增数据的ID
    });
  });
});

// 3. 删除活动接口（根据ID删除）
router.delete('/del', function(req, res, next) {
  // 获取要删除的ID（从Query参数或Body中取，根据前端传参方式调整）
  const { id } = req.query; // 如果前端用Body传参，改成req.body.id
  if (!id) {
    return res.send({ 
      code: 1, 
      msg: '删除失败：活动ID为必填项' 
    });
  }
  // 删除数据的SQL
  const sql = 'DELETE FROM activity WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.send({ 
        code: 1, 
        msg: '删除失败：' + err.message 
      });
    }
    // 检查是否真的删除了数据（affectedRows>0表示删除成功）
    if (results.affectedRows === 0) {
      return res.send({ 
        code: 1, 
        msg: '删除失败：未找到该活动' 
      });
    }
    res.send({ 
      code: 0, 
      msg: '删除接口成功' 
    });
  });
});

// 4. 活动详情接口（根据ID查询单条数据）
router.get('/info', function(req, res, next) {
  // 获取要查询的ID
  const { id } = req.query;
  if (!id) {
    return res.send({ 
      code: 1, 
      msg: '详情查询失败：活动ID为必填项' 
    });
  }
  // 查询单条数据的SQL
  const sql = 'SELECT * FROM activity WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.send({ 
        code: 1, 
        msg: '详情查询失败：' + err.message,
        data: {}
      });
    }
    // 结果为空则返回提示
    if (results.length === 0) {
      return res.send({ 
        code: 1, 
        msg: '未找到该活动',
        data: {}
      });
    }
    // 返回查询到的单条数据
    res.send({ 
      code: 0, 
      msg: '详情接口成功',
      data: results[0] // 取第一条数据
    });
  });
});

// 5. 修改活动接口（根据ID更新数据）
router.post('/edit', function(req, res, next) {
  // 获取要修改的ID和参数
  const { id, title, type, start_time, end_time, state, content } = req.body;
  if (!id) {
    return res.send({ 
      code: 1, 
      msg: '修改失败：活动ID为必填项' 
    });
  }
  // 更新数据的SQL（只更新传了值的字段，避免覆盖空值）
  const updateFields = [];
  const params = [];
  if (title) {
    updateFields.push('title = ?');
    params.push(title);
  }
  if (type) {
    updateFields.push('type = ?');
    params.push(type);
  }
  if (start_time) {
    updateFields.push('start_time = ?');
    params.push(start_time);
  }
  if (end_time) {
    updateFields.push('end_time = ?');
    params.push(end_time);
  }
  if (state !== undefined ) {
    updateFields.push('state = ?');
    params.push(state);
  }
  if (content !== undefined) {
    updateFields.push('content = ?');
    params.push(content);
  }
  // 没有要更新的字段
  if (updateFields.length === 0) {
    return res.send({ 
      code: 1, 
      msg: '修改失败：未传入要更新的字段' 
    });
  }
  // 拼接SQL
  const sql = `UPDATE activity SET ${updateFields.join(', ')} WHERE id = ?`;
  params.push(id); // 最后加ID参数
  db.query(sql, params, (err, results) => {
    if (err) {
      return res.send({ 
        code: 1, 
        msg: '修改失败：' + err.message 
      });
    }
    if (results.affectedRows === 0) {
      return res.send({ 
        code: 1, 
        msg: '修改失败：未找到该活动' 
      });
    }
    res.send({ 
      code: 0, 
      msg: '修改接口成功' 
    });
  });
});

module.exports = router;