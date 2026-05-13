const pool = require("../config/db");

const getFavoritesByUserId = async (userId) => {
  const result = await pool.query(
    `
    SELECT
      f.id AS "favoriteId",
      p.id AS "productId",
      p.name,
      p.description,
      p.price,
      p.discount_price AS "discountPrice",
      p.image_url AS "imageUrl",
      p.color,
      b.name AS brand,
      c.name AS category,
      f.created_at AS "createdAt"
    FROM favorites f
    JOIN products p ON p.id = f.product_id
    LEFT JOIN brands b ON b.id = p.brand_id
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE f.user_id = $1
    ORDER BY f.id DESC
    `,
    [userId]
  );

  return result.rows;
};

const addFavorite = async (userId, productId) => {
  const result = await pool.query(
    `
    INSERT INTO favorites (user_id, product_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, product_id) DO NOTHING
    RETURNING *
    `,
    [userId, productId]
  );

  return result.rows[0];
};

const removeFavorite = async (userId, productId) => {
  const result = await pool.query(
    `
    DELETE FROM favorites
    WHERE user_id = $1 AND product_id = $2
    RETURNING *
    `,
    [userId, productId]
  );

  return result.rows[0];
};

const productExists = async (productId) => {
  const result = await pool.query(
    `
    SELECT id
    FROM products
    WHERE id = $1 AND is_active = true
    `,
    [productId]
  );

  return result.rows[0];
};

module.exports = {
  getFavoritesByUserId,
  addFavorite,
  removeFavorite,
  productExists,
};