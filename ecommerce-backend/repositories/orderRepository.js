const pool = require("../config/db");

const getDefaultCart = async () => {
  const result = await pool.query(`
    SELECT * FROM carts
    WHERE user_id IS NULL
    ORDER BY id ASC
    LIMIT 1
  `);

  return result.rows[0];
};

const getCartItemsForOrder = async () => {
  const cart = await getDefaultCart();

  if (!cart) {
    return [];
  }

  const result = await pool.query(
    `
    SELECT
      ci.id AS "cartItemId",
      ci.quantity,
      p.id AS "productId",
      p.name,
      COALESCE(p.discount_price, p.price) AS "unitPrice",
      pv.id AS "variantId",
      pv.size,
      pv.stock
    FROM cart_items ci
    JOIN products p ON p.id = ci.product_id
    JOIN product_variants pv ON pv.id = ci.variant_id
    WHERE ci.cart_id = $1
    ORDER BY ci.id ASC
    `,
    [cart.id]
  );

  return result.rows;
};

const createOrder = async ({
  totalPrice,
  customerName,
  customerEmail,
  customerPhone,
  address,
}) => {
  const result = await pool.query(
    `
    INSERT INTO orders
    (user_id, total_price, status, customer_name, customer_email, customer_phone, address)
    VALUES (NULL, $1, 'pending', $2, $3, $4, $5)
    RETURNING *
    `,
    [totalPrice, customerName, customerEmail, customerPhone, address]
  );

  return result.rows[0];
};

const createOrderItem = async ({
  orderId,
  productId,
  variantId,
  quantity,
  unitPrice,
  totalPrice,
}) => {
  const result = await pool.query(
    `
    INSERT INTO order_items
    (order_id, product_id, variant_id, quantity, unit_price, total_price)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
    [orderId, productId, variantId, quantity, unitPrice, totalPrice]
  );

  return result.rows[0];
};

const decreaseVariantStock = async (variantId, quantity) => {
  const result = await pool.query(
    `
    UPDATE product_variants
    SET stock = stock - $1
    WHERE id = $2 AND stock >= $1
    RETURNING *
    `,
    [quantity, variantId]
  );

  return result.rows[0];
};

const clearCart = async () => {
  const cart = await getDefaultCart();

  if (!cart) {
    return true;
  }

  await pool.query(
    `
    DELETE FROM cart_items
    WHERE cart_id = $1
    `,
    [cart.id]
  );

  return true;
};

const getAllOrders = async () => {
  const result = await pool.query(`
    SELECT
      id,
      total_price AS "totalPrice",
      status,
      customer_name AS "customerName",
      customer_email AS "customerEmail",
      customer_phone AS "customerPhone",
      address,
      created_at AS "createdAt"
    FROM orders
    ORDER BY id DESC
  `);

  return result.rows;
};

const getOrderById = async (orderId) => {
  const orderResult = await pool.query(
    `
    SELECT
      id,
      total_price AS "totalPrice",
      status,
      customer_name AS "customerName",
      customer_email AS "customerEmail",
      customer_phone AS "customerPhone",
      address,
      created_at AS "createdAt"
    FROM orders
    WHERE id = $1
    `,
    [orderId]
  );

  const order = orderResult.rows[0];

  if (!order) {
    return null;
  }

  const itemsResult = await pool.query(
    `
    SELECT
      oi.id,
      oi.product_id AS "productId",
      oi.variant_id AS "variantId",
      p.name AS "productName",
      p.image_url AS "imageUrl",
      pv.size,
      oi.quantity,
      oi.unit_price AS "unitPrice",
      oi.total_price AS "totalPrice"
    FROM order_items oi
    LEFT JOIN products p ON p.id = oi.product_id
    LEFT JOIN product_variants pv ON pv.id = oi.variant_id
    WHERE oi.order_id = $1
    ORDER BY oi.id ASC
    `,
    [orderId]
  );

  order.items = itemsResult.rows;

  return order;
};

const updateOrderStatus = async (orderId, status) => {
  const result = await pool.query(
    `
    UPDATE orders
    SET status = $1
    WHERE id = $2
    RETURNING
      id,
      total_price AS "totalPrice",
      status,
      customer_name AS "customerName",
      customer_email AS "customerEmail",
      customer_phone AS "customerPhone",
      address,
      created_at AS "createdAt"
    `,
    [status, orderId]
  );

  return result.rows[0];
};

module.exports = {
  getCartItemsForOrder,
  createOrder,
  createOrderItem,
  decreaseVariantStock,
  clearCart,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};