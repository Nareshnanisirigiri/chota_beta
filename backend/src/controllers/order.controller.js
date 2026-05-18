const { query } = require("../config/database");
const { asyncHandler } = require("../utils/async-handler");

const getOrderItems = asyncHandler(async (req, res) => {
  // We join orders, order_items, stores, and media to get the combined view shown in the UI
  const sql = `
    SELECT 
      oi.id AS id,
      o.id AS orderIdNumber,
      o.created_at AS orderDate,
      o.created_at AS createdAt,
      o.billing_name AS customerName,
      o.payment_method AS paymentMethod,
      o.is_rush_order AS isRushOrder,
      o.status AS orderStatus,
      oi.title AS productName,
      oi.variant_title AS variantName,
      s.name AS storeName,
      oi.sku AS sku,
      oi.quantity AS quantity,
      oi.price AS price,
      oi.subtotal AS subtotal,
      oi.status AS status,
      m.id AS mediaId,
      m.file_name AS productImage
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN stores s ON oi.store_id = s.id
    LEFT JOIN (
      SELECT model_id, MIN(id) as first_media_id 
      FROM media 
      WHERE model_type = 'App\\\\Models\\\\Product' 
      GROUP BY model_id
    ) m_ref ON oi.product_id = m_ref.model_id
    LEFT JOIN media m ON m.id = m_ref.first_media_id
    ORDER BY o.created_at DESC
    LIMIT 100
  `;

  const orders = await query(sql);

  res.json({
    success: true,
    data: orders,
  });
});

const updateOrderItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ success: false, message: "Status is required" });
  }

  await query("UPDATE order_items SET status = ? WHERE id = ?", [status, id]);

  res.json({
    success: true,
    message: "Order item updated successfully",
  });
});

const deleteOrderItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await query("DELETE FROM order_items WHERE id = ?", [id]);

  res.json({
    success: true,
    message: "Order item deleted successfully",
  });
});

module.exports = {
  getOrderItems,
  updateOrderItem,
  deleteOrderItem,
};
