const productRepository = require("../repositories/productRepository");

const getAllProducts = async () => {
  return await productRepository.getAllProducts();
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
module.exports = {
  getAllProducts,
  getProductById,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};