// auth.js
const db = require('./db');
const bcrypt = require('bcrypt');

// 註冊
async function register(username, email, password) {
  const [exist] = await db.query(
    "SELECT user_id FROM users WHERE username = ?",
    [username]
  );

  if (exist.length) {
    throw new Error("帳號已存在");
  }

  const password_hash = await bcrypt.hash(password, 10);

  await db.query(
    "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
    [username, email || null, password_hash]
  );
}

// 登入
async function login(username, password) {
  const [rows] = await db.query(
    "SELECT user_id, username, password_hash FROM users WHERE username = ?",
    [username]
  );

  if (!rows.length) {
    throw new Error("帳號或密碼錯誤");
  }

  const user = rows[0];
  const ok = await bcrypt.compare(password, user.password_hash);

  if (!ok) {
    throw new Error("帳號或密碼錯誤");
  }

  return { user_id: user.user_id, username: user.username };
}

module.exports = { register, login };
