// router.js

// 引入 Express 套件
const express = require('express');

// 使用 Express 的 Router (建立可模組化的路由)
const router = express.Router();

// 從 insert.js 引入新增訂單的函式 addOrder (負責把訂單資料寫進資料庫)
const { addOrder } = require('./insert');

// 新增：會員註冊 / 登入
const { register, login } = require('./auth');

// 新增：登入保護（不影響原本功能）
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.status(401).send("請先登入");
  }
  next();
}

//--------------------------------
// 前端頁面路由（GET）

// 開頭動畫頁面
router.get('/', (req, res) => res.render('test', { title: '開頭動畫' }));
// 進入首頁
router.get('/homepage', (req, res) => res.render('homepage', { title: '首頁' }));
// 菜單頁面
router.get('/menu', (req, res) => res.render('menu', { title: '菜單' }));
// 訂購頁面
router.get('/order', (req, res) => res.render('order', { title: '訂購' }));
// 門市資訊頁面
router.get('/storepage', (req, res) => res.render('storepage', { title: '門市資訊' }));
// 品牌故事頁面
router.get('/brandstory', (req, res) => res.render('brandStory', { title: '品牌故事' }));
// 常見問題頁面
router.get('/frequentlyaskedquestions', (req, res) => res.render('frequentlyaskedquestions', { title: '常見問題' }));

//--------------------------------
// 新增：會員註冊

// 前端會用 POST /api/register 傳送註冊資料
router.post('/api/register', async (req, res) => {

  try {
    // 從前端 req.body 取出使用者填寫的資料
    const { username, email, password } = req.body;

    // 基本資料驗證：帳號與密碼為必填。
    if (!username || !password) {
      return res.status(400).json({ error: "資料不完整" });
    }

    // 呼叫 register 函式
    // 負責將帳號資料寫入資料庫
    await register(username, email, password);

    // 註冊成功後回傳成功訊息給前端
    res.json({ message: "註冊成功" });
  } catch (err) {
    // 若註冊失敗（例如帳號已存在）
    // 回傳錯誤訊息給前端
    res.status(400).json({ error: err.message });
  }
});

//--------------------------------
// 新增：會員登入（寫入 session）

// 前端會用 POST /api/login 傳送登入資料
router.post('/api/login', async (req, res) => {

  try {
    // 取得前端送來的帳號與密碼
    const { username, password } = req.body;

    // 檢查是否有缺少欄位。
    if (!username || !password) {
      return res.status(400).json({ error: "資料不完整" });
    }

    // 呼叫 login 函式驗證帳密，如果成功會回傳使用者資料。
    const user = await login(username, password);

    // ⭐ 登入成功 → 存進 session
    req.session.user = user;

    // 回傳登入成功訊息與使用者資料給前端
    res.json({ message: "登入成功", user });
  } catch (err) {
    // 登入失敗(ex.帳密錯誤)，回傳錯誤訊息給前端。
    res.status(401).json({ error: err.message });
  }
});

//--------------------------------
// 登出

// 使用 GET /logout 進行登出
router.get('/logout', (req, res) => {

   // 銷毀目前使用者的 session
  req.session.destroy(() => {
    
    // 登出後導回首頁
    res.redirect('/homepage'); 
  });
});


//--------------------------------
// API：新增訂單（POST）

// 當前端送出訂單資料到 /api/order 時會進入這裡
router.post('/api/order', async (req, res) => {

  // 從前端送來的 req.body 中取出訂單資料
  const { customer_name, phone, pickup_method, cart } = req.body;

  // 檢查資料是否完整
  // 如果有任何一個欄位是空的，或購物車沒有商品，就回傳 400 錯誤（使用者送來的資料有問題）。
  if (!customer_name || !phone || !pickup_method || !cart || !cart.length) {
    return res.status(400).json({ error: '資料不完整' });
  }

  try {
    // 呼叫 addOrder 函式，將訂單寫入資料庫
    // await 表示要等資料庫完成後才繼續執行
    const order_id = await addOrder(customer_name, phone, pickup_method, cart);
    
    // 成功後回傳 JSON 給前端
    res.json({ message: '訂單新增成功', order_id });
  } catch (err) {
    
    // 如果新增訂單時發生錯誤，會進入這裡。
    console.error("新增訂單失敗(完整錯誤)：", err);

    // 除錯用：把 MySQL/程式錯誤回傳給前端（之後上線再改回簡短訊息）
    res.status(500).json({
      error: '新增訂單失敗',
      code: err.code,
      errno: err.errno,
      sqlMessage: err.sqlMessage,
      sqlState: err.sqlState,
      message: err.message
    });
  }
});

// 將 router 匯出，讓 server.js 可以使用。
module.exports = router;
