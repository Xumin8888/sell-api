const express = require("express");
const router = express.Router();
const multer = require("multer");

const conn = require("./db/conn");



/* 添加文章分类 */
router.post("/addArticleType", (req, res) => {
    let { title } = req.body;
    if (!title) {
        res.send({ code: 5001, msg: "参数错误!" });
        return;
    }
    const sql1 = `select * from article_type where title="${title}"`;
    conn.query(sql1, (err, data) => {
        if (data.length) {
            res.send({ code: 1, msg: '添加的文章标题已经存在！！！' })
        } else {
            const sql = `insert into article_type(title) values("${title}")`;
            conn.query(sql, (err, data) => {
                if (data.affectedRows > 0) {
                    res.send({ code: 0, msg: "添加文章分类成功" });
                } else {
                    res.send({ code: 1, msg: "添加文章分类失败" });
                }
            });
        }
    });
});

/*查询所有文章分类 */
router.get("/typeList", (req, res) => {
    let { currentPage, pageSize } = req.query;

    //查询所有数据 无分页
    if (!currentPage || !pageSize) {
        let sql = `select * from article_type`;
        conn.query(sql, (err, data) => {
            if (err) throw err;
            total = data.length;
            res.send({ total, data });
        });
    } else {
        //查询所有分页数据
        let sql = `select * from article_type`;
        let total;

        conn.query(sql, (err, data) => {
            if (err) throw err;
            total = data.length;

            let n = (currentPage - 1) * pageSize;
            sql += ` limit ${n}, ${pageSize}`;

            conn.query(sql, (err, data) => {
                if (err) throw err;
                res.send({ total, data });
            });
        });
    }
});

/* 删除文章分类 */
router.post("/delType", (req, res) => {
    const { id } = req.body;

    if (!id) {
        res.send({ code: 5001, msg: "参数错误!" });
        return;
    }

    const sql = `delete from article_type where id=${id}`;

    conn.query(sql, (err, data) => {
        if (err) throw err;
        if (data.affectedRows > 0) {
            res.send({ code: 0, msg: "删除文章分类成功" });
        } else {
            res.send({ code: 1, msg: "删除文章分类失败" });
        }
    });
});

//   添加文章
router.post("/add", (req, res) => {
    let { type_name, title, content } = req.body;
    if (!title && !type_name && !content) {
        res.send({ code: 5001, msg: "参数错误!" });
        return;
    }
    const sql1 = `select * from article_type where title="${type_name}"`;
    conn.query(sql1, (err, data) => {
        if (data.length > 0) {
            let nowDate = new Date().getTime();
            const sql = `insert into article(type_name,title,create_time,content) values("${type_name}","${title}","${nowDate}",'${content}') `;
            console.log(sql)
          
            conn.query(sql, (err, data) => {
                if (data.affectedRows > 0) {
                    res.send({ code: 0, msg: "添加文章成功" });
                } else {
                    res.send({ code: 1, msg: "添加文章失败" });
                }
            });
        } else {
            res.send({ code: 1, msg: "没有找到该分类！！！" });
        }
    })
});


//   编辑文章
router.post("/edit", (req, res) => {
    let { id, type_name, title, content } = req.body;
    if (!id && !title && !type_name && !content) {
        res.send({ code: 5001, msg: "参数错误!" });
        return;
    }
    const sql = `update article set type_name="${type_name}", title="${title} ",content='${content}' where id=${id}`;
    console.log(sql);
    conn.query(sql, (err, data) => {
        if (data.affectedRows > 0) {
            res.send({ code: 0, msg: "修改文章成功" });
        } else {
            res.send({ code: 1, msg: "修改文章失败" });
        }
    });
})


/*查询所有文章 */
router.get("/list", (req, res) => {
    let { currentPage, pageSize } = req.query;

    //查询所有数据 无分页
    if (!currentPage || !pageSize) {
        res.send({ code: 5001, msg: "参数错误!" });
        return;
    } else {
        //查询所有分页数据
        let sql = `select * from article`;
        let total;

        conn.query(sql, (err, data) => {
            if (err) throw err;
            total = data.length;

            let n = (currentPage - 1) * pageSize;
            sql += ` limit ${n}, ${pageSize}`;

            conn.query(sql, (err, data) => {
                if (err) throw err;
                res.send({ total, data });
            });
        });
    }
});

/* 删除文章 */
router.get("/del", (req, res) => {
    const { id } = req.query;

    if (!id) {
        res.send({ code: 5001, msg: "参数错误!" });
        return;
    }

    const sql = `delete from article where id=${id}`;

    conn.query(sql, (err, data) => {
        if (err) throw err;
        if (data.affectedRows > 0) {
            res.send({ code: 0, msg: "删除文章成功" });
        } else {
            res.send({ code: 1, msg: "删除文章失败" });
        }
    });
});


/*文章详情*/
router.get("/info", (req, res) => {
    const { id } = req.query;

    if (!id) {
        res.send({ code: 5001, msg: "参数错误!" });
        return;
    }

    const sql = `select * from article where id=${id}`;

    conn.query(sql, (err, data) => {
        if (err) throw err;
        if (data) {
            res.send({ code: 0, data:data });
        } else {
            res.send({ code: 1, msg: "查找文章失败" });
        }
    });
});


module.exports = router;
