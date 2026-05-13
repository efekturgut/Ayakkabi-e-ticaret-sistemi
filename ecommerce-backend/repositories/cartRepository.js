const pool = require("../config/db");

const getDefaultCart = async () => {
  const existingCart = await pool.query(`
    SELECT * FROM carts
    WHERE user_id IS NULL
    ORDER BY id ASC
    LIMIT 1
  `);

  if (existingCart.rows.length > 0) {
    return existingCart.rows[0];
  }

  const newCart = await pool.query(`
    INSERT INTO carts (user_id)
    VALUES (NULL)
    RETURNING *
  `);

  return newCart.rows[0];
};

const getCartItems = async () => {
  const cart = await getDefaultCart();

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

const addItemToCart = async ({ productId, variantId, quantity }) => {
  const cart = await getDefaultCart();

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

const updateCartItemQuantity = async (cartItemId, quantity) => {
  const result = await pool.query(
    `
    UPDATE cart_items
    SET quantity = $1
    WHERE id = $2
    RETURNING *
    `,
    [quantity, cartItemId]
  );

  return result.rows[0];
};

const removeCartItem = async (cartItemId) => {
  const result = await pool.query(
    `
    DELETE FROM cart_items
    WHERE id = $1
    RETURNING *
    `,
    [cartItemId]
  );

  return result.rows[0];
};

const clearCart = async () => {
  const cart = await getDefaultCart();

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
};