const pool = require("../config/db");

const getReviewsByProductId = async (productId) => {
  const result = await pool.query(
    `
    SELECT
      r.id,
      r.rating,
      r.comment,
      r.created_at AS "createdAt",
      r.updated_at AS "updatedAt",
      u.id AS "userId",
      u.name AS "userName"
    FROM reviews r
    JOIN users u ON u.id = r.user_id
    WHERE r.product_id = $1
    ORDER BY r.id DESC
    `,
    [productId]
  );

  return result.rows;
};

const createReview = async ({ userId, productId, rating, comment }) => {
  const result = await pool.query(
    `
    INSERT INTO reviews (user_id, product_id, rating, comment)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id, product_id)
    DO UPDATE SET
      rating = EXCLUDED.rating,
      comment = EXCLUDED.comment,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *
    `,
    [userId, productId, rating, comment || null]
  );

  return result.rows[0];
};

const updateReview = async ({ userId, reviewId, rating, comment }) => {
  const result = await pool.query(
    `
    UPDATE reviews
    SET
      rating = COALESCE($1, rating),
      comment = COALESCE($2, comment),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $3 AND user_id = $4
    RETURNING *
    `,
    [rating || null, comment || null, reviewId, userId]
  );

  return result.rows[0];
};

const deleteReview = async (userId, reviewId) => {
  const result = await pool.query(
    `
    DELETE FROM reviews
    WHERE id = $1 AND user_id = $2
    RETURNING *
    `,
    [reviewId, userId]
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
  getReviewsByProductId,
  createReview,
  updateReview,
  deleteReview,
  productExists,
};