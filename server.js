const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// 解析 JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 新增：Session（會員登入狀態用）
const session = require('express-session');
app.use(session({
  secret: 'drink_shop_secret_key_please_change',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true }
}));

// 讓所有 EJS 都能直接用 user（不用每個 res.render 都手動傳）
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// 設定 EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 靜態檔案
app.use(express.static(path.join(__dirname, 'public')));

// 引入路由
const routes = require('./router');
app.use('/', routes);  // 所有路由交給 router.js 管理

// 啟動伺服器
app.listen(port, () => {
  console.log(`伺服器已啟動！請訪問 http://localhost:${port}`);
});
