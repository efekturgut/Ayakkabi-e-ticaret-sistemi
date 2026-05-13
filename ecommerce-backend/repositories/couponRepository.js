const pool = require("../config/db");

const getCouponByCode = async (code) => {
  const result = await pool.query(
    `
    SELECT *
    FROM coupons
    WHERE UPPER(code) = UPPER($1)
    `,
    [code]
  );

  return result.rows[0];
};

const increaseCouponUsage = async (couponId) => {
  const result = await pool.query(
    `
    UPDATE coupons
    SET used_count = used_count + 1
    WHERE id = $1
    RETURNING *
    `,
    [couponId]
  );

  return result.rows[0];
};

const getAllCoupons = async () => {
  const result = await pool.query(
    `
    SELECT
      id,
      code,
      discount_type AS "discountType",
      discount_value AS "discountValue",
      min_order_amount AS "minOrderAmount",
      usage_limit AS "usageLimit",
      used_count AS "usedCount",
      is_active AS "isActive",
      expires_at AS "expiresAt",
      created_at AS "createdAt"
    FROM coupons
    ORDER BY id DESC
    `
  );

  return result.rows;
};

const createCoupon = async ({
  code,
  discountType,
  discountValue,
  minOrderAmount,
  usageLimit,
  expiresAt,
}) => {
  const result = await pool.query(
    `
    INSERT INTO coupons
    (
      code,
      discount_type,
      discount_value,
      min_order_amount,
      usage_limit,
      expires_at
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING
      id,
      code,
      discount_type AS "discountType",
      discount_value AS "discountValue",
      min_order_amount AS "minOrderAmount",
      usage_limit AS "usageLimit",
      used_count AS "usedCount",
      is_active AS "isActive",
      expires_at AS "expiresAt",
      created_at AS "createdAt"
    `,
    [
      code.toUpperCase(),
      discountType,
      discountValue,
      minOrderAmount || 0,
      usageLimit || null,
      expiresAt || null,
    ]
  );

  return result.rows[0];
};

const updateCouponStatus = async (couponId, isActive) => {
  const result = await pool.query(
    `
    UPDATE coupons
    SET is_active = $1
    WHERE id = $2
    RETURNING
      id,
      code,
      discount_type AS "discountType",
      discount_value AS "discountValue",
      min_order_amount AS "minOrderAmount",
      usage_limit AS "usageLimit",
      used_count AS "usedCount",
      is_active AS "isActive",
      expires_at AS "expiresAt",
      created_at AS "createdAt"
    `,
    [isActive, couponId]
  );

  return result.rows[0];
};

module.exports = {
  getCouponByCode,
  increaseCouponUsage,
  getAllCoupons,
  createCoupon,
  updateCouponStatus,
};