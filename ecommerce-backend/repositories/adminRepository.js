const pool = require("../config/db");

const getDashboardStats = async () => {
  const totalProductsResult = await pool.query(`
    SELECT COUNT(*) AS total
    FROM products
    WHERE is_active = true
  `);

  const totalUsersResult = await pool.query(`
    SELECT COUNT(*) AS total
    FROM users
  `);

  const totalOrdersResult = await pool.query(`
    SELECT COUNT(*) AS total
    FROM orders
  `);

  const totalRevenueResult = await pool.query(`
    SELECT COALESCE(SUM(final_price), 0) AS total
    FROM orders
    WHERE status != 'cancelled'
  `);

  const pendingOrdersResult = await pool.query(`
    SELECT COUNT(*) AS total
    FROM orders
    WHERE status = 'pending'
  `);

  const lowStockProductsResult = await pool.query(`
    SELECT
      pv.id AS "variantId",
      p.id AS "productId",
      p.name AS "productName",
      p.image_url AS "imageUrl",
      pv.size,
      pv.stock,
      pv.sku
    FROM product_variants pv
    JOIN products p ON p.id = pv.product_id
    WHERE pv.stock <= 3
    ORDER BY pv.stock ASC
    LIMIT 10
  `);

  const bestSellingProductsResult = await pool.query(`
    SELECT
      p.id AS "productId",
      p.name AS "productName",
      p.image_url AS "imageUrl",
      SUM(oi.quantity) AS "totalSold",
      SUM(oi.total_price) AS "totalRevenue"
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    JOIN orders o ON o.id = oi.order_id
    WHERE o.status != 'cancelled'
    GROUP BY p.id, p.name, p.image_url
    ORDER BY SUM(oi.quantity) DESC
    LIMIT 10
  `);

  const recentOrdersResult = await pool.query(`
    SELECT
      o.id,
      o.user_id AS "userId",
      u.name AS "userName",
      u.email AS "userEmail",
      o.total_price AS "totalPrice",
      o.discount_amount AS "discountAmount",
      o.final_price AS "finalPrice",
      o.coupon_code AS "couponCode",
      o.status,
      o.customer_name AS "customerName",
      o.customer_email AS "customerEmail",
      o.created_at AS "createdAt"
    FROM orders o
    LEFT JOIN users u ON u.id = o.user_id
    ORDER BY o.id DESC
    LIMIT 10
  `);

  return {
    summary: {
      totalProducts: Number(totalProductsResult.rows[0].total),
      totalUsers: Number(totalUsersResult.rows[0].total),
      totalOrders: Number(totalOrdersResult.rows[0].total),
      totalRevenue: Number(totalRevenueResult.rows[0].total),
      pendingOrders: Number(pendingOrdersResult.rows[0].total),
    },
    lowStockProducts: lowStockProductsResult.rows,
    bestSellingProducts: bestSellingProductsResult.rows,
    recentOrders: recentOrdersResult.rows,
  };
};

module.exports = {
  getDashboardStats,
};