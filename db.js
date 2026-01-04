const mysql = require('mysql2');
const dotenv = require('dotenv'); // 1. 引入 dotenv

// 2. 啟動 dotenv（會把 .env 載入到 process.env）
dotenv.config();

// 建立連線池
const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'sql_tutorial',
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONN_LIMIT) || 10,
    queueLimit: Number(process.env.DB_QUEUE_LIMIT) || 0
});

// 用一次測試連線，方便確認成功或失敗
pool.getConnection((err, connection) => {
    if (err) {
        console.error('資料庫連線失敗：', err.message);
    } else {
        console.log('成功連線到 MySQL 資料庫');
        connection.release();
    }
});

module.exports = pool.promise(); // 使用 promise 方式
