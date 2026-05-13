const pool = require("../config/db");

const getOrCreateCart = async (userId) => {
  const existingCart = await pool.query(
    `
    SELECT *
    FROM carts
    WHERE user_id = $1
    ORDER BY id ASC
    LIMIT 1
    `,
    [userId]
  );

  if (existingCart.rows.length > 0) {
    return existingCart.rows[0];
  }

  const newCart = await pool.query(
    `
    INSERT INTO carts (user_id)
    VALUES ($1)
    RETURNING *
    `,
    [userId]
  );

  return newCart.rows[0];
};

const getCartItems = async (userId) => {
  const cart = await getOrCreateCart(userId);

  const result = await pool.query(
    `
    SELECT
      ci.id AS "cartItemId",
      ci.quantity,
      p.id AS "productId",
      p.name,
      p.price,
      p.discount_price AS "discountPrice",
      p.image_url AS "imageUrl",
      b.name AS brand,
      pv.id AS "variantId",
      pv.size,
      pv.stock,
      COALESCE(p.discount_price, p.price) AS "finalPrice",
      (COALESCE(p.discount_price, p.price) * ci.quantity) AS "totalPrice"
    FROM cart_items ci
    JOIN products p ON p.id = ci.product_id
    LEFT JOIN brands b ON b.id = p.brand_id
    JOIN product_variants pv ON pv.id = ci.variant_id
    WHERE ci.cart_id = $1
    ORDER BY ci.id DESC
    `,
    [cart.id]
  );

  return result.rows;
};

const addItemToCart = async ({ userId, productId, variantId, quantity }) => {
  const cart = await getOrCreateCart(userId);

  const result = await pool.query(
    `
    INSERT INTO cart_items (cart_id, product_id, variant_id, quantity)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (cart_id, product_id, variant_id)
    DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
    RETURNING *
    `,
    [cart.id, productId, variantId, quantity]
  );

  return result.rows[0];
};

const updateCartItemQuantity = async (userId, cartItemId, quantity) => {
  const cart = await getOrCreateCart(userId);

  const result = await pool.query(
    `
    UPDATE cart_items
    SET quantity = $1
    WHERE id = $2 AND cart_id = $3
    RETURNING *
    `,
    [quantity, cartItemId, cart.id]
  );

  return result.rows[0];
};

const removeCartItem = async (userId, cartItemId) => {
  const cart = await getOrCreateCart(userId);

  const result = await pool.query(
    `
    DELETE FROM cart_items
    WHERE id = $1 AND cart_id = $2
    RETURNING *
    `,
    [cartItemId, cart.id]
  );

  return result.rows[0];
};

const clearCart = async (userId) => {
  const cart = await getOrCreateCart(userId);

  await pool.query(
    `
    DELETE FROM cart_items
    WHERE cart_id = $1
    `,
    [cart.id]
  );

  return true;
};

const getVariantById = async (variantId) => {
  const result = await pool.query(
    `
    SELECT *
    FROM product_variants
    WHERE id = $1
    `,
    [variantId]
  );

  return result.rows[0];
};

module.exports = {
  getCartItems,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  getVariantById,
  getOrCreateCart,
};