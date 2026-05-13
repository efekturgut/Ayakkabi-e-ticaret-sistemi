const pool = require("../config/db");

const getAllProducts = async () => {
  const result = await pool.query(`
    SELECT 
      p.id,
      p.name,
      p.description,
      p.price,
      p.discount_price AS "discountPrice",
      p.gender,
      p.color,
      p.image_url AS "imageUrl",
      p.is_active AS "isActive",
      b.name AS brand,
      c.name AS category,
      COALESCE(
        json_agg(
          json_build_object(
            'id', pv.id,
            'size', pv.size,
            'stock', pv.stock,
            'sku', pv.sku
          )
        ) FILTER (WHERE pv.id IS NOT NULL),
        '[]'
      ) AS variants
    FROM products p
    LEFT JOIN brands b ON b.id = p.brand_id
    LEFT JOIN categories c ON c.id = p.category_id
    LEFT JOIN product_variants pv ON pv.product_id = p.id
    WHERE p.is_active = true
    GROUP BY p.id, b.name, c.name
    ORDER BY p.id DESC
  `);

  return result.rows;
};

const getProductById = async (id) => {
  const result = await pool.query(
    `
    SELECT 
      p.id,
      p.name,
      p.description,
      p.price,
      p.discount_price AS "discountPrice",
      p.gender,
      p.color,
      p.image_url AS "imageUrl",
      p.is_active AS "isActive",
      b.name AS brand,
      c.name AS category,
      COALESCE(
        json_agg(
          json_build_object(
            'id', pv.id,
            'size', pv.size,
            'stock', pv.stock,
            'sku', pv.sku
          )
        ) FILTER (WHERE pv.id IS NOT NULL),
        '[]'
      ) AS variants
    FROM products p
    LEFT JOIN brands b ON b.id = p.brand_id
    LEFT JOIN categories c ON c.id = p.category_id
    LEFT JOIN product_variants pv ON pv.product_id = p.id
    WHERE p.id = $1
    GROUP BY p.id, b.name, c.name
    `,
    [id]
  );

  return result.rows[0];
};

const searchProducts = async (query) => {
  const result = await pool.query(
    `
    SELECT 
      p.id,
      p.name,
      p.description,
      p.price,
      p.discount_price AS "discountPrice",
      p.gender,
      p.color,
      p.image_url AS "imageUrl",
      b.name AS brand,
      c.name AS category
    FROM products p
    LEFT JOIN brands b ON b.id = p.brand_id
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE LOWER(p.name) LIKE LOWER($1)
    ORDER BY p.id DESC
    `,
    [`%${query}%`]
  );

  return result.rows;
};

module.exports = {
  getAllProducts,
  getProductById,
  searchProducts,
};