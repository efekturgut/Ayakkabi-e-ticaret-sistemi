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

const createProduct = async ({
  brandId,
  categoryId,
  name,
  description,
  price,
  discountPrice,
  gender,
  color,
  imageUrl,
}) => {
  const result = await pool.query(
    `
    INSERT INTO products
    (
      brand_id,
      category_id,
      name,
      description,
      price,
      discount_price,
      gender,
      color,
      image_url,
      is_active
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,true)
    RETURNING *
    `,
    [
      brandId || null,
      categoryId || null,
      name,
      description || null,
      price,
      discountPrice || null,
      gender || "unisex",
      color || null,
      imageUrl || null,
    ]
  );

  return result.rows[0];
};

const updateProduct = async (
  id,
  {
    brandId,
    categoryId,
    name,
    description,
    price,
    discountPrice,
    gender,
    color,
    imageUrl,
  }
) => {
  const result = await pool.query(
    `
    UPDATE products
    SET
      brand_id = COALESCE($1, brand_id),
      category_id = COALESCE($2, category_id),
      name = COALESCE($3, name),
      description = COALESCE($4, description),
      price = COALESCE($5, price),
      discount_price = COALESCE($6, discount_price),
      gender = COALESCE($7, gender),
      color = COALESCE($8, color),
      image_url = COALESCE($9, image_url)
    WHERE id = $10
    RETURNING *
    `,
    [
      brandId || null,
      categoryId || null,
      name || null,
      description || null,
      price || null,
      discountPrice || null,
      gender || null,
      color || null,
      imageUrl || null,
      id,
    ]
  );

  return result.rows[0];
};

const deleteProduct = async (id) => {
  const result = await pool.query(
    `
    UPDATE products
    SET is_active = false
    WHERE id = $1
    RETURNING *
    `,
    [id]
  );

  return result.rows[0];
};

module.exports = {
  getAllProducts,
  getProductById,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};