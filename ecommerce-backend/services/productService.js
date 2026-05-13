const productRepository = require("../repositories/productRepository");

const getAllProducts = async (filters) => {
  return await productRepository.getAllProducts(filters);
};
const getProductById = async (id) => {
  if (!id || isNaN(id)) {
    const error = new Error("Geçerli bir ürün ID gerekli");
    error.statusCode = 400;
    throw error;
  }

  const product = await productRepository.getProductById(id);

  if (!product) {
    const error = new Error("Ürün bulunamadı");
    error.statusCode = 404;
    throw error;
  }

  return product;
};

const searchProducts = async (query) => {
  if (!query) {
    const error = new Error("Arama kelimesi gerekli");
    error.statusCode = 400;
    throw error;
  }

  return await productRepository.searchProducts(query);
};

const createProduct = async (data) => {
  if (!data.name || !data.price) {
    const error = new Error("Ürün adı ve fiyat zorunludur");
    error.statusCode = 400;
    throw error;
  }

  return await productRepository.createProduct(data);
};

const updateProduct = async (id, data) => {
  if (!id || isNaN(id)) {
    const error = new Error("Geçerli bir ürün ID gerekli");
    error.statusCode = 400;
    throw error;
  }

  const product = await productRepository.updateProduct(id, data);

  if (!product) {
    const error = new Error("Ürün bulunamadı");
    error.statusCode = 404;
    throw error;
  }

  return product;
};

const deleteProduct = async (id) => {
  if (!id || isNaN(id)) {
    const error = new Error("Geçerli bir ürün ID gerekli");
    error.statusCode = 400;
    throw error;
  }

  const product = await productRepository.deleteProduct(id);

  if (!product) {
    const error = new Error("Ürün bulunamadı");
    error.statusCode = 404;
    throw error;
  }

  return product;
};

const createProductVariant = async (productId, { size, stock, sku }) => {
  if (!productId || isNaN(productId)) {
    const error = new Error("Geçerli bir ürün ID gerekli");
    error.statusCode = 400;
    throw error;
  }

  if (!size) {
    const error = new Error("Numara bilgisi zorunludur");
    error.statusCode = 400;
    throw error;
  }

  const variant = await productRepository.createProductVariant({
    productId,
    size,
    stock: stock || 0,
    sku,
  });

  return variant;
};

const updateProductVariant = async (variantId, { size, stock, sku }) => {
  if (!variantId || isNaN(variantId)) {
    const error = new Error("Geçerli bir varyant ID gerekli");
    error.statusCode = 400;
    throw error;
  }

  const variant = await productRepository.updateProductVariant(variantId, {
    size,
    stock,
    sku,
  });

  if (!variant) {
    const error = new Error("Ürün varyantı bulunamadı");
    error.statusCode = 404;
    throw error;
  }

  return variant;
};

const deleteProductVariant = async (variantId) => {
  if (!variantId || isNaN(variantId)) {
    const error = new Error("Geçerli bir varyant ID gerekli");
    error.statusCode = 400;
    throw error;
  }

  const variant = await productRepository.deleteProductVariant(variantId);

  if (!variant) {
    const error = new Error("Ürün varyantı bulunamadı");
    error.statusCode = 404;
    throw error;
  }

  return variant;
};
module.exports = {
  getAllProducts,
  getProductById,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductVariant,
updateProductVariant,
deleteProductVariant,
};