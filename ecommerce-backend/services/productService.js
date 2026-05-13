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

module.exports = {
  getAllProducts,
  getProductById,
  searchProducts,
};