const pool = require("../config/db");
const getAllProducts = async (filters = {}) => {
  const {
    search,
    brand,
    category,
    size,
    minPrice,
    maxPrice,
    page = 1,
    limit = 12,
  } = filters;

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 12;
  const offset = (pageNumber - 1) * limitNumber;

  const whereConditions = ["p.is_active = true"];
  const values = [];
  let paramIndex = 1;

  if (search) {
    whereConditions.push(`LOWER(p.name) LIKE LOWER($${paramIndex})`);
    values.push(`%${search}%`);
    paramIndex++;
  }

  if (brand) {
    whereConditions.push(`LOWER(b.name) = LOWER($${paramIndex})`);
    values.push(brand);
    paramIndex++;
  }

  if (category) {
    whereConditions.push(`LOWER(c.name) = LOWER($${paramIndex})`);
    values.push(category);
    paramIndex++;
  }

  if (minPrice) {
    whereConditions.push(`COALESCE(p.discount_price, p.price) >= $${paramIndex}`);
    values.push(Number(minPrice));
    paramIndex++;
  }

  if (maxPrice) {
    whereConditions.push(`COALESCE(p.discount_price, p.price) <= $${paramIndex}`);
    values.push(Number(maxPrice));
    paramIndex++;
  }

  if (size) {
    whereConditions.push(`
      EXISTS (
        SELECT 1
        FROM product_variants pv_size
        WHERE pv_size.product_id = p.id
        AND pv_size.size = $${paramIndex}
        AND pv_size.stock > 0
      )
    `);
    values.push(size);
    paramIndex++;
  }

  const whereClause = whereConditions.join(" AND ");

  const productsResult = await pool.query(
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
          ORDER BY pv.size
        ) FILTER (WHERE pv.id IS NOT NULL),
        '[]'
      ) AS variants
    FROM products p
    LEFT JOIN brands b ON b.id = p.brand_id
    LEFT JOIN categories c ON c.id = p.category_id
    LEFT JOIN product_variants pv ON pv.product_id = p.id
    WHERE ${whereClause}
    GROUP BY p.id, b.name, c.name
    ORDER BY p.id DESC
    LIMIT $${paramIndex}
    OFFSET $${paramIndex + 1}
    `,
    [...values, limitNumber, offset]
  );

  const countResult = await pool.query(
    `
    SELECT COUNT(DISTINCT p.id) AS total
    FROM products p
    LEFT JOIN brands b ON b.id = p.brand_id
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE ${whereClause}
    `,
    values
  );

  const total = Number(countResult.rows[0].total);
  const totalPages = Math.ceil(total / limitNumber);

  return {
    products: productsResult.rows,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages,
      hasNextPage: pageNumber < totalPages,
      hasPrevPage: pageNumber > 1,
    },
  };
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


const createProductVariant = async ({ productId, size, stock, sku }) => {
  const finalSku = sku || `PRODUCT-${productId}-SIZE-${size}`;

  const result = await pool.query(
    `
    INSERT INTO product_variants (product_id, size, stock, sku)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [productId, size, stock, finalSku]
  );

  return result.rows[0];
};

const updateProductVariant = async (variantId, { size, stock, sku }) => {
  const result = await pool.query(
    `
    UPDATE product_variants
    SET
      size = COALESCE($1, size),
      stock = COALESCE($2, stock),
      sku = COALESCE($3, sku)
    WHERE id = $4
    RETURNING *
    `,
    [
      size || null,
      stock === undefined ? null : stock,
      sku || null,
      variantId,
    ]
  );

  return result.rows[0];
};

const deleteProductVariant = async (variantId) => {
  const result = await pool.query(
    `
    DELETE FROM product_variants
    WHERE id = $1
    RETURNING *
    `,
    [variantId]
  );

  return result.rows[0];
};
module.exports = {
  createProductVariant,
updateProductVariant,
deleteProductVariant,
  getAllProducts,
  getProductById,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};