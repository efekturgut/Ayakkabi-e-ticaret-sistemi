const pool = require("../config/db");

const findOrCreateBrand = async (brandName) => {
  const cleanName = brandName || "Unknown";

  const existingBrand = await pool.query(
    "SELECT id FROM brands WHERE LOWER(name) = LOWER($1)",
    [cleanName]
  );

  if (existingBrand.rows.length > 0) {
    return existingBrand.rows[0].id;
  }

  const newBrand = await pool.query(
    "INSERT INTO brands (name) VALUES ($1) RETURNING id",
    [cleanName]
  );

  return newBrand.rows[0].id;
};

const findOrCreateCategory = async (categoryName) => {
  const cleanName = categoryName || "Sneaker";

  const existingCategory = await pool.query(
    "SELECT id FROM categories WHERE LOWER(name) = LOWER($1)",
    [cleanName]
  );

  if (existingCategory.rows.length > 0) {
    return existingCategory.rows[0].id;
  }

  const newCategory = await pool.query(
    "INSERT INTO categories (name) VALUES ($1) RETURNING id",
    [cleanName]
  );

  return newCategory.rows[0].id;
};

const createProductFromKicksDB = async (product) => {
  const brandId = await findOrCreateBrand(product.brand);
  const categoryId = await findOrCreateCategory("Sneaker");

  const externalId =
    product.id ||
    product.uuid ||
    product.sku ||
    product.styleId ||
    product.urlKey ||
    product.slug ||
    product.name;

  const name = product.name || product.title || "Unknown Sneaker";
  const description =
    product.description ||
    `${name} sneaker product imported from KicksDB.`;

  const price =
    product.retailPrice ||
    product.price ||
    product.lowestAsk ||
    product.market?.lowestAsk ||
    0;

  const color =
    product.colorway ||
    product.color ||
    product.primaryCategory ||
    null;

  const imageUrl =
    product.image ||
    product.imageUrl ||
    product.thumbnail ||
    product.media?.imageUrl ||
    product.media?.smallImageUrl ||
    null;

  const slug = product.slug || product.urlKey || null;
  const releaseDate = product.releaseDate || product.release_date || null;

  const result = await pool.query(
    `
    INSERT INTO products
    (
      external_id,
      brand_id,
      category_id,
      name,
      description,
      price,
      discount_price,
      gender,
      color,
      image_url,
      slug,
      release_date,
      is_active
    )
    VALUES
    ($1, $2, $3, $4, $5, $6, NULL, 'unisex', $7, $8, $9, $10, true)
    ON CONFLICT (external_id)
    DO UPDATE SET
      name = EXCLUDED.name,
      price = EXCLUDED.price,
      color = EXCLUDED.color,
      image_url = EXCLUDED.image_url
    RETURNING *
    `,
    [
      externalId,
      brandId,
      categoryId,
      name,
      description,
      price,
      color,
      imageUrl,
      slug,
      releaseDate,
    ]
  );

  return result.rows[0];
};

module.exports = {
  createProductFromKicksDB,
};