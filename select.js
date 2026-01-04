// 引入資料庫連線模組(db.js 內通常是 MySQL 連線池設定，負責和資料庫溝通。)
const db = require('./db');

// 查詢所有訂單

// 這是一個非同步函式，用來取得所有訂單資料。
async function getOrders() {
    // SQL 語法：從 order 資料表中查詢全部資料
    // order 是 MySQL 關鍵字，所以使用反引號「`」包起來避免衝突、
    const sql = "SELECT * FROM `order`";
    try {
        // 執行 SQL 查詢
        // db.query 會回傳一個陣列，[rows, fields]
        // 這裡只取出 rows（查詢結果）
        const [rows] = await db.query(sql);
        // 將查詢到的訂單資料印出來，方便除錯。
        console.log("Orders:", rows);
        return rows; // 回傳訂單資料
    } catch (err) {
        // 如果查詢過程發生錯誤，印出錯誤訊息並拋出錯誤。
        console.error(err);
        throw err;
    }
}

//--------------------------------
// 查詢某筆訂單的明細

// orderId 是要查詢的訂單編號
async function getOrderItems(orderId) {

    // SQL 語法：查詢指定 order_id 的訂單明細
    // 使用「?」佔位符可避免 SQL Injection（資安考量）
    const sql = "SELECT * FROM `order_items` WHERE `order_id` = ?";
    try {
        // 執行查詢，並將 orderId 傳入 SQL 佔位符。
        const [rows] = await db.query(sql, [orderId]);

        // 印出該筆訂單的所有商品明細（除錯用）
        console.log(`Order ${orderId} items:`, rows);
        return rows; // 回傳訂單明細資料
    } catch (err) {
        // 發生錯誤時印出錯誤訊息並拋出錯誤。
        console.error(err);
        throw err;
    }
}


// 將這兩個查詢函式匯出
// 讓其他檔案（例如 router 或 controller）可以使用
module.exports = { getOrders, getOrderItems };