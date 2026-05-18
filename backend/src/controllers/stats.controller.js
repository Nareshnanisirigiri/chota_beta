const { query } = require("../config/database");
const { asyncHandler } = require("../utils/async-handler");

const getStats = asyncHandler(async (req, res) => {
  const [totalOrders] = await query("SELECT COUNT(*) as count FROM orders");
  const [totalSellers] = await query("SELECT COUNT(*) as count FROM sellers");
  const [totalProducts] = await query("SELECT COUNT(*) as count FROM products");
  const [totalRevenue] = await query("SELECT SUM(total_payable) as total FROM orders WHERE status = 'DELIVERED'");

  res.json({
    success: true,
    data: {
      ordersCount: totalOrders.count,
      sellersCount: totalSellers.count,
      productsCount: totalProducts.count,
      revenue: totalRevenue.total || 0
    }
  });
});

module.exports = {
  getStats
};
