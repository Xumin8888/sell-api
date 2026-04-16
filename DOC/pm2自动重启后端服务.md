# pm2 开启服务进程

> 接口服务报错中断 服务之后，pm2 会自动重启后端的接口服务

# 1.全局安装 pm2 

```js
npm install pm2 -g
```

# 2.配置后端服务启动命令

```json
  "scripts": {
    "start": "nodemon ./bin/www",
    "run": " pm2 start ./bin/www",
    "stop": " pm2 stop ./bin/www"
  },
```

# 3.通过pm2 启动 和 停止后端服务

```js
pm2 run   #启动后端服务 进程
pm2 stop  #停止后端服务 进程
```







