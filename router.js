// router.js
const express = require('express');
const router = express.Router();
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

// 前端頁面路由
router.get('/', (req, res) => res.render('test', { title: '開頭動畫' }));
router.get('/homepage', (req, res) => res.render('homepage', { title: '首頁' }));
router.get('/menu', (req, res) => res.render('menu', { title: '菜單' }));
router.get('/order', (req, res) => res.render('order', { title: '訂購', user: req.session.user }));
router.get('/storepage', (req, res) => res.render('storepage', { title: '門市資訊' }));
router.get('/brandstory', (req, res) => res.render('brandStory', { title: '品牌故事' }));
router.get('/frequentlyaskedquestions', (req, res) => res.render('frequentlyaskedquestions', { title: '常見問題' }));
router.get('/login', (req, res) =>res.render('login', { title: '登入' }));
router.get('/register', (req, res) =>res.render('register', { title: '註冊' }));


// 新增：會員註冊
router.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "資料不完整" });
    }

    await register(username, email, password);
    res.json({ message: "註冊成功" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 新增：會員登入（寫入 session）
router.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "資料不完整" });
    }

    const user = await login(username, password);

    // ⭐ 登入成功 → 存進 session
    req.session.user = user;

    res.json({ message: "登入成功", user });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

// 登出
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/homepage'); // 回首頁
  });
});


// API: 新增訂單
router.post('/api/order', async (req, res) => {
  const { customer_name, phone, pickup_method, cart } = req.body;

  if (!customer_name || !phone || !pickup_method || !cart || !cart.length) {
    return res.status(400).json({ error: '資料不完整' });
  }

  try {
    const order_id = await addOrder(customer_name, phone, pickup_method, cart);
    res.json({ message: '訂單新增成功', order_id });
  } catch (err) {
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

module.exports = router;
