const db = require('./db');

// 新增訂單
async function addOrder(customer_name, phone, pickup_method, cart) {
  try {
    const total = cart.reduce((sum, p) => sum + Number(p.price || 0), 0);

    // ✅ order 是保留字，一定要加反引號
    const [orderResult] = await db.query(
      "INSERT INTO `order` (customer_name, phone, pickup_method, total) VALUES (?, ?, ?, ?)",
      [customer_name, phone, pickup_method, total]
    );

    const order_id = orderResult.insertId;

    // cart 轉成批次 values
    const itemValues = cart.map(p => [order_id, p.name, Number(p.price || 0)]);

    await db.query(
      "INSERT INTO order_items (order_id, product_name, price) VALUES ?",
      [itemValues]
    );

    console.log("新增訂單成功，訂單編號：", order_id);
    return order_id;
  } catch (err) {
    console.error("addOrder 失敗：", err);
    // ✅ 不要吞錯，丟回去讓 router catch 得到
    throw err;
  }
}

module.exports = { addOrder };
